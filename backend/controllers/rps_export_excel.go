package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"sort"
	"strconv"
	"strings"
	"time"

	"smart-rps-backend/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/xuri/excelize/v2"
)

// ExportExcel exports RPS to Excel format
func (gc *GeneratedRPSController) ExportExcel(c *gin.Context) {
	rpsID := c.Param("id")

	var rps models.GeneratedRPS
	err := gc.db.
		Preload("Course").
		Preload("Course.Program").
		Preload("Course.Program.Prodi").
		Where("id = ?", rpsID).
		First(&rps).Error

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "RPS not found"})
		return
	}

	// Get Dosen info
	var dosens []models.Dosen
	gc.db.Preload("Prodi").
		Joins("JOIN dosen_courses ON dosen_courses.dosen_id = dosens.id").
		Where("dosen_courses.course_id = ?", rps.CourseID).
		Find(&dosens)

	// Parse result JSON
	var result map[string]interface{}
	if err := json.Unmarshal(rps.Result, &result); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse RPS data"})
		return
	}

	// Query CPMK from database to get matched_cpl
	var cpmkList []models.CPMK
	fmt.Printf("[DEBUG Excel] Loading CPMK from database for courseID=%v\n", rps.CourseID)
	if err := gc.db.Where("course_id = ?", rps.CourseID).
		Order("cpmk_number ASC").
		Find(&cpmkList).Error; err == nil && len(cpmkList) > 0 {

		fmt.Printf("[DEBUG Excel] Found %d CPMK in database\n", len(cpmkList))
		for i, dbCPMK := range cpmkList {
			cpmkCode := fmt.Sprintf("CPMK-%d", dbCPMK.CPMKNumber)
			fmt.Printf("[DEBUG Excel] DB CPMK[%d]: code=%s, matched_cpl=%s\n", i, cpmkCode, dbCPMK.MatchedCPL)
		}

		// Update result with matched_cpl from database
		if cpmkData, ok := result["cpmk"].([]interface{}); ok {
			fmt.Printf("[DEBUG Excel] Updating %d CPMK entries from JSON with DB data\n", len(cpmkData))
			for i, cpmk := range cpmkData {
				if cpmkMap, ok := cpmk.(map[string]interface{}); ok {
					cpmkCode := getMapValue(cpmkMap, "code")

					// Find matching CPMK in database by code
					for _, dbCPMK := range cpmkList {
						dbCPMKCode := fmt.Sprintf("CPMK-%d", dbCPMK.CPMKNumber)
						if dbCPMKCode == cpmkCode {
							cpmkMap["matched_cpl"] = dbCPMK.MatchedCPL
							cpmkData[i] = cpmkMap
							fmt.Printf("[DEBUG Excel] ✅ Updated %s with matched_cpl=%s\n", cpmkCode, dbCPMK.MatchedCPL)
							break
						}
					}
				}
			}
			result["cpmk"] = cpmkData
		}
	} else {
		fmt.Printf("[DEBUG Excel] Failed to load CPMK from DB. Error: %v, Count: %d\n", err, len(cpmkList))
	}

	// Build CPL list from CPMK matched_cpl (like HTML export does)
	cplData, hasCPL := result["cpl"].([]interface{})
	if !hasCPL || len(cplData) == 0 {
		fmt.Printf("[DEBUG Excel] Building CPL from matched_cpl...\n")
		// Extract unique CPL codes from CPMK matched_cpl field
		// Also build reverse mapping: CPL -> list of CPMK
		cplMap := make(map[string]bool)
		cplToCpmkMap := make(map[string][]string) // CPL code -> list of CPMK codes
		if cpmkData, ok := result["cpmk"].([]interface{}); ok {
			fmt.Printf("[DEBUG Excel] Found %d CPMK entries\n", len(cpmkData))
			for idx, cpmk := range cpmkData {
				if cpmkMap, ok := cpmk.(map[string]interface{}); ok {
					cpmkCode := getMapValue(cpmkMap, "code")
					matchedCPL := getMapValue(cpmkMap, "matched_cpl")
					fmt.Printf("[DEBUG Excel] CPMK[%d]: code=%s, matched_cpl=%s\n", idx, cpmkCode, matchedCPL)
					if matchedCPL != "-" && matchedCPL != "" {
						// Split by comma
						cplCodes := strings.Split(matchedCPL, ",")
						for _, code := range cplCodes {
							code = strings.TrimSpace(code)
							if code != "" && code != "-" {
								cplMap[code] = true
								// Add to reverse mapping
								cplToCpmkMap[code] = append(cplToCpmkMap[code], cpmkCode)
								fmt.Printf("[DEBUG Excel] Added CPL: %s -> CPMK: %s\n", code, cpmkCode)
							}
						}
					}
				}
			}
		} else {
			fmt.Printf("[DEBUG Excel] No CPMK data found in result\n")
		}

		// Convert map to sorted array and fetch CPL details from database
		if len(cplMap) > 0 {
			cplCodes := make([]string, 0, len(cplMap))
			for code := range cplMap {
				cplCodes = append(cplCodes, code)
			}
			sort.Strings(cplCodes)

			fmt.Printf("[DEBUG Excel] Created %d CPL entries: %v\n", len(cplCodes), cplCodes)

			// Try to get ProdiID from Course -> Program
			var prodiID *uuid.UUID
			if rps.Course != nil && rps.Course.Program != nil {
				if rps.Course.Program.ProdiID != nil {
					prodiID = rps.Course.Program.ProdiID
				} else if rps.Course.Program.Prodi != nil {
					prodiID = &rps.Course.Program.Prodi.ID
				}
			}

			// Fetch CPL details from database
			cplDetailsMap := make(map[string]models.CPL)
			if prodiID != nil {
				var cplList []models.CPL
				if err := gc.db.Where("prodi_id = ?", *prodiID).Find(&cplList).Error; err == nil {
					for _, cpl := range cplList {
						cplDetailsMap[cpl.KodeCPL] = cpl
						fmt.Printf("[DEBUG Excel] Loaded CPL from DB: %s = %s\n", cpl.KodeCPL, cpl.CPL[:min(50, len(cpl.CPL))])
					}
				}
			}

			// Create CPL data array with details from database
			cplDataNew := make([]interface{}, len(cplCodes))
			for i, code := range cplCodes {
				description := "-"
				komponen := "-"

				// Try to get details from database
				if cpl, exists := cplDetailsMap[code]; exists {
					description = cpl.CPL
					komponen = cpl.Komponen
				}

				// Get related CPMK codes
				relatedCPMK := "-"
				if cpmks, exists := cplToCpmkMap[code]; exists && len(cpmks) > 0 {
					relatedCPMK = strings.Join(cpmks, ", ")
				}

				cplDataNew[i] = map[string]interface{}{
					"code":         code,
					"description":  description,
					"komponen":     komponen,
					"related_cpmk": relatedCPMK,
				}
				fmt.Printf("[DEBUG Excel] CPL %s: desc=%s, komponen=%s, cpmk=%s\n", code, description[:min(30, len(description))], komponen, relatedCPMK)
			}
			result["cpl"] = cplDataNew
		} else {
			fmt.Printf("[DEBUG Excel] No CPL codes found in matched_cpl\n")
		}
	} else {
		fmt.Printf("[DEBUG Excel] CPL already exists, count=%d\n", len(cplData))
	}

	// Create Excel file
	f := excelize.NewFile()
	defer f.Close()

	// Create sheets
	createInfoSheet(f, &rps, dosens, result)
	createCPMKSheet(f, result)
	createSubCPMKSheet(f, result)
	createRencanaSheet(f, result)
	createTugasSheet(f, result)
	createPenilaianSheet(f, result)

	// Delete default sheet
	f.DeleteSheet("Sheet1")
	f.SetActiveSheet(0)

	// Send file
	filename := fmt.Sprintf("RPS_%s.xlsx", rps.Course.Title)
	c.Header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
	c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=\"%s\"", filename))

	if err := f.Write(c.Writer); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate Excel file"})
		return
	}
}

// createInfoSheet creates the general information sheet
func createInfoSheet(f *excelize.File, rps *models.GeneratedRPS, dosens []models.Dosen, result map[string]interface{}) {
	sheetName := "Informasi Umum"
	index, _ := f.NewSheet(sheetName)
	f.SetActiveSheet(index)

	// Set column widths
	f.SetColWidth(sheetName, "A", "A", 25)
	f.SetColWidth(sheetName, "B", "B", 50)

	// Header style
	headerStyle, _ := f.NewStyle(&excelize.Style{
		Font:      &excelize.Font{Bold: true, Size: 12, Color: "#FFFFFF"},
		Fill:      excelize.Fill{Type: "pattern", Color: []string{"#4472C4"}, Pattern: 1},
		Alignment: &excelize.Alignment{Horizontal: "left", Vertical: "center"},
	})

	// Data style
	dataStyle, _ := f.NewStyle(&excelize.Style{
		Font:      &excelize.Font{Size: 11},
		Alignment: &excelize.Alignment{Vertical: "center", WrapText: true},
	})

	// Title
	f.SetCellValue(sheetName, "A1", "RENCANA PEMBELAJARAN SEMESTER (RPS)")
	titleStyle, _ := f.NewStyle(&excelize.Style{
		Font:      &excelize.Font{Bold: true, Size: 14},
		Alignment: &excelize.Alignment{Horizontal: "center"},
	})
	f.SetCellStyle(sheetName, "A1", "B1", titleStyle)
	f.MergeCell(sheetName, "A1", "B1")
	f.SetRowHeight(sheetName, 1, 25)

	// Data rows
	row := 3
	data := [][]string{
		{"Mata Kuliah", rps.Course.Title},
		{"Kode MK", rps.Course.Code},
		{"Program Studi", getStringValue(rps.Course.Program, "Name")},
		{"Fakultas", getStringValue(rps.Course.Program.Prodi, "Fakultas")},
		{"SKS", getIntPtrValue(rps.Course.Credits)},
		{"Semester", getIntPtrValue(rps.Course.Semester)},
		{"Tahun Akademik", rps.Course.Tahun},
		{"Tanggal Penyusunan", time.Now().Format("02 January 2006")},
	}

	// Add dosen names
	var dosenNames string
	for i, d := range dosens {
		if i > 0 {
			dosenNames += ", "
		}
		dosenNames += d.NamaLengkap
	}
	data = append(data, []string{"Dosen Pengampu", dosenNames})

	// Add deskripsi MK
	if desc, ok := result["deskripsi_mk"].(string); ok && desc != "" {
		data = append(data, []string{"Deskripsi Mata Kuliah", desc})
	}

	// Add referensi
	if referensi, ok := result["referensi"].([]interface{}); ok && len(referensi) > 0 {
		var refList string
		for i, ref := range referensi {
			refList += fmt.Sprintf("%d. %v\n", i+1, ref)
		}
		data = append(data, []string{"Referensi", refList})
	}

	for _, item := range data {
		f.SetCellValue(sheetName, fmt.Sprintf("A%d", row), item[0])
		f.SetCellValue(sheetName, fmt.Sprintf("B%d", row), item[1])
		f.SetCellStyle(sheetName, fmt.Sprintf("A%d", row), fmt.Sprintf("A%d", row), headerStyle)
		f.SetCellStyle(sheetName, fmt.Sprintf("B%d", row), fmt.Sprintf("B%d", row), dataStyle)
		f.SetRowHeight(sheetName, row, 20)
		row++
	}
}

// createCPLSheet creates the CPL sheet
func createCPLSheet(f *excelize.File, result map[string]interface{}) {
	sheetName := "CPL"
	f.NewSheet(sheetName)

	// Set column widths
	f.SetColWidth(sheetName, "A", "A", 5)
	f.SetColWidth(sheetName, "B", "B", 15)
	f.SetColWidth(sheetName, "C", "C", 60)
	f.SetColWidth(sheetName, "D", "D", 20)
	f.SetColWidth(sheetName, "E", "E", 30)

	// Styles
	headerStyle, _ := f.NewStyle(&excelize.Style{
		Font:      &excelize.Font{Bold: true, Size: 11, Color: "#FFFFFF"},
		Fill:      excelize.Fill{Type: "pattern", Color: []string{"#4472C4"}, Pattern: 1},
		Alignment: &excelize.Alignment{Horizontal: "center", Vertical: "center"},
		Border:    getBorder(),
	})

	dataStyle, _ := f.NewStyle(&excelize.Style{
		Font:      &excelize.Font{Size: 10},
		Alignment: &excelize.Alignment{Vertical: "top", WrapText: true},
		Border:    getBorder(),
	})

	// Headers
	headers := []string{"No", "Kode CPL", "Capaian Pembelajaran Lulusan", "Komponen", "CPMK Terkait"}
	for i, header := range headers {
		cell := string(rune('A'+i)) + "1"
		f.SetCellValue(sheetName, cell, header)
		f.SetCellStyle(sheetName, cell, cell, headerStyle)
	}
	f.SetRowHeight(sheetName, 1, 25)

	// Build CPL to CPMK mapping from matched_cpl field
	cplToCPMK := make(map[string][]string)
	if cpmkData, ok := result["cpmk"].([]interface{}); ok {
		for _, cpmk := range cpmkData {
			if cpmkMap, ok := cpmk.(map[string]interface{}); ok {
				cpmkCode := getMapValue(cpmkMap, "code")

				// Get matched_cpl (comma-separated CPL codes)
				matchedCPL := getMapValue(cpmkMap, "matched_cpl")
				if matchedCPL != "-" {
					cplCodes := strings.Split(matchedCPL, ",")
					for _, cplCode := range cplCodes {
						cplCode = strings.TrimSpace(cplCode)
						if cplCode != "" && cplCode != "-" {
							cplToCPMK[cplCode] = append(cplToCPMK[cplCode], cpmkCode)
						}
					}
				}
			}
		}
	}

	// CPL data
	row := 2
	if cplData, ok := result["cpl"].([]interface{}); ok {
		for idx, cpl := range cplData {
			if cplMap, ok := cpl.(map[string]interface{}); ok {
				code := getMapValue(cplMap, "code")
				if code == "-" {
					code = getMapValue(cplMap, "kode_cpl")
				}

				description := getMapValue(cplMap, "description")
				if description == "-" {
					description = getMapValue(cplMap, "cpl")
				}

				komponen := getMapValue(cplMap, "komponen")

				// Get related CPMK
				relatedCPMK := "-"
				if cpmkList, exists := cplToCPMK[code]; exists && len(cpmkList) > 0 {
					relatedCPMK = strings.Join(cpmkList, ", ")
				}

				f.SetCellValue(sheetName, fmt.Sprintf("A%d", row), idx+1)
				f.SetCellValue(sheetName, fmt.Sprintf("B%d", row), code)
				f.SetCellValue(sheetName, fmt.Sprintf("C%d", row), description)
				f.SetCellValue(sheetName, fmt.Sprintf("D%d", row), komponen)
				f.SetCellValue(sheetName, fmt.Sprintf("E%d", row), relatedCPMK)

				f.SetCellStyle(sheetName, fmt.Sprintf("A%d", row), fmt.Sprintf("E%d", row), dataStyle)
				f.SetRowHeight(sheetName, row, 30)
				row++
			}
		}
	}
}

// createCPMKSheet creates the CPMK sheet
func createCPMKSheet(f *excelize.File, result map[string]interface{}) {
	sheetName := "CPMK & Sub-CPMK"
	f.NewSheet(sheetName)

	// Set column widths
	f.SetColWidth(sheetName, "A", "A", 8)
	f.SetColWidth(sheetName, "B", "B", 15)
	f.SetColWidth(sheetName, "C", "C", 50)
	f.SetColWidth(sheetName, "D", "D", 15)
	f.SetColWidth(sheetName, "E", "E", 20)

	// Styles
	headerStyle, _ := f.NewStyle(&excelize.Style{
		Font:      &excelize.Font{Bold: true, Size: 11, Color: "#FFFFFF"},
		Fill:      excelize.Fill{Type: "pattern", Color: []string{"#4472C4"}, Pattern: 1},
		Alignment: &excelize.Alignment{Horizontal: "center", Vertical: "center"},
		Border:    getBorder(),
	})

	dataStyle, _ := f.NewStyle(&excelize.Style{
		Font:      &excelize.Font{Size: 10},
		Alignment: &excelize.Alignment{Vertical: "top", WrapText: true},
		Border:    getBorder(),
	})

	titleStyle, _ := f.NewStyle(&excelize.Style{
		Font:      &excelize.Font{Bold: true, Size: 12},
		Alignment: &excelize.Alignment{Horizontal: "left", Vertical: "center"},
	})

	row := 1

	// === CPMK (Capaian Pembelajaran Mata Kuliah) ===
	f.SetCellValue(sheetName, fmt.Sprintf("A%d", row), "CAPAIAN PEMBELAJARAN MATA KULIAH (CPMK)")
	f.MergeCell(sheetName, fmt.Sprintf("A%d", row), fmt.Sprintf("E%d", row))
	f.SetCellStyle(sheetName, fmt.Sprintf("A%d", row), fmt.Sprintf("E%d", row), titleStyle)
	f.SetRowHeight(sheetName, row, 25)
	row++

	// CPMK Headers
	headers := []string{"No", "Kode CPMK", "Deskripsi", "Bobot", "CPL Terkait"}
	for i, header := range headers {
		cell := string(rune('A'+i)) + fmt.Sprintf("%d", row)
		f.SetCellValue(sheetName, cell, header)
		f.SetCellStyle(sheetName, cell, cell, headerStyle)
	}
	f.SetRowHeight(sheetName, row, 25)
	row++

	// CPMK Data
	if cpmkData, ok := result["cpmk"].([]interface{}); ok {
		// Calculate equal distribution if bobot is missing
		totalCPMK := len(cpmkData)
		defaultBobot := 0
		if totalCPMK > 0 {
			defaultBobot = 100 / totalCPMK
		}

		for i, cpmk := range cpmkData {
			if cpmkMap, ok := cpmk.(map[string]interface{}); ok {
				f.SetCellValue(sheetName, fmt.Sprintf("A%d", row), i+1)
				f.SetCellValue(sheetName, fmt.Sprintf("B%d", row), getMapValue(cpmkMap, "code"))
				f.SetCellValue(sheetName, fmt.Sprintf("C%d", row), getMapValue(cpmkMap, "description"))

				// Try to get bobot, use default if not available
				bobot := getMapValue(cpmkMap, "bobot")
				if bobot == "-" {
					bobot = getMapValue(cpmkMap, "bobotPersen")
				}
				if bobot == "-" && defaultBobot > 0 {
					bobot = fmt.Sprintf("%d%%", defaultBobot)
				}
				f.SetCellValue(sheetName, fmt.Sprintf("D%d", row), bobot)

				// Add matched CPL
				matchedCPL := getMapValue(cpmkMap, "matched_cpl")
				f.SetCellValue(sheetName, fmt.Sprintf("E%d", row), matchedCPL)

				f.SetCellStyle(sheetName, fmt.Sprintf("A%d", row), fmt.Sprintf("E%d", row), dataStyle)
				f.SetRowHeight(sheetName, row, 30)
				row++
			}
		}
	}
}

// createSubCPMKSheet creates the Sub-CPMK sheet with bobot
func createSubCPMKSheet(f *excelize.File, result map[string]interface{}) {
	sheetName := "Sub-CPMK"
	f.NewSheet(sheetName)

	// Set column widths
	f.SetColWidth(sheetName, "A", "A", 8)
	f.SetColWidth(sheetName, "B", "B", 15)
	f.SetColWidth(sheetName, "C", "C", 60)
	f.SetColWidth(sheetName, "D", "D", 10)

	// Styles
	headerStyle, _ := f.NewStyle(&excelize.Style{
		Font:      &excelize.Font{Bold: true, Size: 11, Color: "#FFFFFF"},
		Fill:      excelize.Fill{Type: "pattern", Color: []string{"#28A745"}, Pattern: 1},
		Alignment: &excelize.Alignment{Horizontal: "center", Vertical: "center"},
		Border:    getBorder(),
	})

	dataStyle, _ := f.NewStyle(&excelize.Style{
		Font:      &excelize.Font{Size: 10},
		Alignment: &excelize.Alignment{Vertical: "top", WrapText: true},
		Border:    getBorder(),
	})

	// Headers
	headers := []string{"No", "Sub-CPMK", "Deskripsi", "Bobot (%)"}
	for i, header := range headers {
		cell := string(rune('A'+i)) + "1"
		f.SetCellValue(sheetName, cell, header)
		f.SetCellStyle(sheetName, cell, cell, headerStyle)
	}
	f.SetRowHeight(sheetName, 1, 25)

	// Sub-CPMK Data - Support both top-level and nested formats
	row := 2
	no := 1

	// Try top-level subCpmk array first (frontend format)
	var subCpmkData []interface{}
	if data, ok := result["subCpmk"].([]interface{}); ok {
		subCpmkData = data
	} else if data, ok := result["sub_cpmk"].([]interface{}); ok {
		subCpmkData = data
	} else if cpmkData, ok := result["cpmk"].([]interface{}); ok {
		// Fallback: nested in CPMK (old format)
		for _, cpmk := range cpmkData {
			if cpmkMap, ok := cpmk.(map[string]interface{}); ok {
				if subList, ok := cpmkMap["sub_cpmk"].([]interface{}); ok {
					subCpmkData = append(subCpmkData, subList...)
				}
			}
		}
	}

	// Calculate equal bobot with decimal precision
	totalSubCPMK := len(subCpmkData)
	var defaultBobot float64
	if totalSubCPMK > 0 {
		defaultBobot = 100.0 / float64(totalSubCPMK)
	}

	for _, subCpmk := range subCpmkData {
		if subMap, ok := subCpmk.(map[string]interface{}); ok {
			f.SetCellValue(sheetName, fmt.Sprintf("A%d", row), no)
			f.SetCellValue(sheetName, fmt.Sprintf("B%d", row), getMapValue(subMap, "code"))
			f.SetCellValue(sheetName, fmt.Sprintf("C%d", row), getMapValue(subMap, "description"))

			bobot := getMapValue(subMap, "bobotPersen")
			if bobot == "-" {
				bobot = getMapValue(subMap, "bobot")
			}
			if bobot == "-" && defaultBobot > 0 {
				bobot = fmt.Sprintf("%.2f%%", defaultBobot)
			}
			f.SetCellValue(sheetName, fmt.Sprintf("D%d", row), bobot)

			f.SetCellStyle(sheetName, fmt.Sprintf("A%d", row), fmt.Sprintf("D%d", row), dataStyle)
			f.SetRowHeight(sheetName, row, 30)
			row++
			no++
		}
	}
}

// createRencanaSheet creates the weekly plan sheet
func createRencanaSheet(f *excelize.File, result map[string]interface{}) {
	sheetName := "Rencana Mingguan"
	f.NewSheet(sheetName)

	// Set column widths
	f.SetColWidth(sheetName, "A", "A", 8)
	f.SetColWidth(sheetName, "B", "B", 40)
	f.SetColWidth(sheetName, "C", "C", 40)
	f.SetColWidth(sheetName, "D", "D", 25)
	f.SetColWidth(sheetName, "E", "E", 10)

	// Styles
	headerStyle, _ := f.NewStyle(&excelize.Style{
		Font:      &excelize.Font{Bold: true, Size: 11, Color: "#FFFFFF"},
		Fill:      excelize.Fill{Type: "pattern", Color: []string{"#4472C4"}, Pattern: 1},
		Alignment: &excelize.Alignment{Horizontal: "center", Vertical: "center"},
		Border:    getBorder(),
	})

	dataStyle, _ := f.NewStyle(&excelize.Style{
		Font:      &excelize.Font{Size: 10},
		Alignment: &excelize.Alignment{Vertical: "top", WrapText: true},
		Border:    getBorder(),
	})

	// Headers
	headers := []string{"Minggu", "Materi", "Metode Pembelajaran", "Indikator", "Waktu"}
	for i, header := range headers {
		cell := string(rune('A'+i)) + "1"
		f.SetCellValue(sheetName, cell, header)
		f.SetCellStyle(sheetName, cell, cell, headerStyle)
	}
	f.SetRowHeight(sheetName, 1, 25)

	// Weekly plan data - Support both camelCase and snake_case
	row := 2
	var rencanaMingguan []interface{}
	if data, ok := result["rencanaMingguan"].([]interface{}); ok {
		rencanaMingguan = data
	} else if data, ok := result["rencana_mingguan"].([]interface{}); ok {
		rencanaMingguan = data
	}

	for _, minggu := range rencanaMingguan {
		if mingguMap, ok := minggu.(map[string]interface{}); ok {
			// Get minggu number
			mingguNum := getMapValue(mingguMap, "minggu")

			// Try materi first (camelCase), then topik_materi (snake_case)
			materi := getMapValue(mingguMap, "materi")
			if materi == "-" {
				materi = getMapValue(mingguMap, "topik_materi")
			}

			// Try metode first (camelCase), then metode_pembelajaran (snake_case)
			metode := getMapValue(mingguMap, "metode")
			if metode == "-" {
				metode = getMapValue(mingguMap, "metode_pembelajaran")
			}

			// Indikator - try subCpmk first (frontend uses this field)
			indikator := getMapValue(mingguMap, "subCpmk")
			if indikator == "-" {
				indikator = getMapValue(mingguMap, "indikator")
			}

			// Try waktu first (camelCase), then waktu_belajar (snake_case)
			waktu := getMapValue(mingguMap, "waktu")
			if waktu == "-" {
				waktu = getMapValue(mingguMap, "waktu_belajar")
			}

			f.SetCellValue(sheetName, fmt.Sprintf("A%d", row), mingguNum)
			f.SetCellValue(sheetName, fmt.Sprintf("B%d", row), materi)
			f.SetCellValue(sheetName, fmt.Sprintf("C%d", row), metode)
			f.SetCellValue(sheetName, fmt.Sprintf("D%d", row), indikator)
			f.SetCellValue(sheetName, fmt.Sprintf("E%d", row), waktu)

			f.SetCellStyle(sheetName, fmt.Sprintf("A%d", row), fmt.Sprintf("E%d", row), dataStyle)
			f.SetRowHeight(sheetName, row, 35)
			row++
		}
	}
}

// createTugasSheet creates the task/assignment sheet with bobot
func createTugasSheet(f *excelize.File, result map[string]interface{}) {
	sheetName := "Rencana Tugas"
	f.NewSheet(sheetName)

	// Set column widths
	f.SetColWidth(sheetName, "A", "A", 8)
	f.SetColWidth(sheetName, "B", "B", 30)
	f.SetColWidth(sheetName, "C", "C", 15)
	f.SetColWidth(sheetName, "D", "D", 40)
	f.SetColWidth(sheetName, "E", "E", 25)
	f.SetColWidth(sheetName, "F", "F", 10)

	// Styles
	headerStyle, _ := f.NewStyle(&excelize.Style{
		Font:      &excelize.Font{Bold: true, Size: 11, Color: "#FFFFFF"},
		Fill:      excelize.Fill{Type: "pattern", Color: []string{"#FF6B6B"}, Pattern: 1},
		Alignment: &excelize.Alignment{Horizontal: "center", Vertical: "center"},
		Border:    getBorder(),
	})

	dataStyle, _ := f.NewStyle(&excelize.Style{
		Font:      &excelize.Font{Size: 10},
		Alignment: &excelize.Alignment{Vertical: "top", WrapText: true},
		Border:    getBorder(),
	})

	// Headers
	headers := []string{"No", "Judul Tugas", "Batas Waktu", "Deskripsi", "Kriteria Penilaian", "Bobot (%)"}
	for i, header := range headers {
		cell := string(rune('A'+i)) + "1"
		f.SetCellValue(sheetName, cell, header)
		f.SetCellStyle(sheetName, cell, cell, headerStyle)
	}
	f.SetRowHeight(sheetName, 1, 25)

	// Task data - Support both camelCase and snake_case
	row := 2
	var tugasData []interface{}
	if data, ok := result["rencanaTugas"].([]interface{}); ok {
		tugasData = data
	} else if data, ok := result["rencana_tugas"].([]interface{}); ok {
		tugasData = data
	}

	for i, tugas := range tugasData {
		if tugasMap, ok := tugas.(map[string]interface{}); ok {
			f.SetCellValue(sheetName, fmt.Sprintf("A%d", row), i+1)

			// Try camelCase first, fallback to snake_case
			judul := getMapValue(tugasMap, "judulTugas")
			if judul == "-" {
				judul = getMapValue(tugasMap, "judul_tugas")
			}
			batas := getMapValue(tugasMap, "batasWaktu")
			if batas == "-" {
				batas = getMapValue(tugasMap, "batas_waktu")
			}
			deskripsi := getMapValue(tugasMap, "petunjukPengerjaan")
			if deskripsi == "-" {
				deskripsi = getMapValue(tugasMap, "petunjuk")
			}
			kriteria := getMapValue(tugasMap, "kriteriaPenilaian")
			if kriteria == "-" {
				kriteria = getMapValue(tugasMap, "kriteria_penilaian")
			}
			bobot := getMapValue(tugasMap, "bobotPersen")
			if bobot == "-" {
				bobot = getMapValue(tugasMap, "bobot_persen")
			}

			f.SetCellValue(sheetName, fmt.Sprintf("B%d", row), judul)
			f.SetCellValue(sheetName, fmt.Sprintf("C%d", row), batas)
			f.SetCellValue(sheetName, fmt.Sprintf("D%d", row), deskripsi)
			f.SetCellValue(sheetName, fmt.Sprintf("E%d", row), kriteria)
			f.SetCellValue(sheetName, fmt.Sprintf("F%d", row), bobot)

			f.SetCellStyle(sheetName, fmt.Sprintf("A%d", row), fmt.Sprintf("F%d", row), dataStyle)
			f.SetRowHeight(sheetName, row, 40)
			row++
		}
	}
}

// createPenilaianSheet creates the assessment sheet
func createPenilaianSheet(f *excelize.File, result map[string]interface{}) {
	sheetName := "Penilaian"
	f.NewSheet(sheetName)

	// Set column widths
	f.SetColWidth(sheetName, "A", "A", 8)
	f.SetColWidth(sheetName, "B", "B", 35)
	f.SetColWidth(sheetName, "C", "C", 25)
	f.SetColWidth(sheetName, "D", "D", 10)

	// Styles
	headerStyle, _ := f.NewStyle(&excelize.Style{
		Font:      &excelize.Font{Bold: true, Size: 11, Color: "#FFFFFF"},
		Fill:      excelize.Fill{Type: "pattern", Color: []string{"#4472C4"}, Pattern: 1},
		Alignment: &excelize.Alignment{Horizontal: "center", Vertical: "center"},
		Border:    getBorder(),
	})

	dataStyle, _ := f.NewStyle(&excelize.Style{
		Font:      &excelize.Font{Size: 10},
		Alignment: &excelize.Alignment{Vertical: "top", WrapText: true},
		Border:    getBorder(),
	})

	// Headers
	headers := []string{"Minggu", "Topik Materi", "Jenis Assessment", "Bobot (%)"}
	for i, header := range headers {
		cell := string(rune('A'+i)) + "1"
		f.SetCellValue(sheetName, cell, header)
		f.SetCellStyle(sheetName, cell, cell, headerStyle)
	}
	f.SetRowHeight(sheetName, 1, 25)

	// Assessment data - try analisis_penilaian first, then fallback to rencanaTugas
	row := 2
	var penilaianData []interface{}

	if analisisPenilaian, ok := result["analisis_penilaian"].([]interface{}); ok && len(analisisPenilaian) > 0 {
		penilaianData = analisisPenilaian
	} else if rencanaTugas, ok := result["rencanaTugas"].([]interface{}); ok && len(rencanaTugas) > 0 {
		penilaianData = rencanaTugas
	} else if rencanaTugas, ok := result["rencana_tugas"].([]interface{}); ok && len(rencanaTugas) > 0 {
		penilaianData = rencanaTugas
	}

	for _, penilaian := range penilaianData {
		if penilaianMap, ok := penilaian.(map[string]interface{}); ok {
			// Try different field names for minggu
			minggu := getMapValue(penilaianMap, "minggu")
			if minggu == "-" {
				minggu = getMapValue(penilaianMap, "tugasKe")
			}

			// Try different field names for topik
			topik := getMapValue(penilaianMap, "topik_materi")
			if topik == "-" {
				topik = getMapValue(penilaianMap, "judulTugas")
			}

			// Try different field names for jenis
			jenis := getMapValue(penilaianMap, "jenis_assessment")
			if jenis == "-" {
				jenis = getMapValue(penilaianMap, "teknikPenilaian")
			}

			// Try different field names for bobot
			bobot := getMapValue(penilaianMap, "bobot")
			if bobot == "-" {
				bobot = getMapValue(penilaianMap, "bobotPersen")
			}

			f.SetCellValue(sheetName, fmt.Sprintf("A%d", row), minggu)
			f.SetCellValue(sheetName, fmt.Sprintf("B%d", row), topik)
			f.SetCellValue(sheetName, fmt.Sprintf("C%d", row), jenis)
			f.SetCellValue(sheetName, fmt.Sprintf("D%d", row), bobot)

			f.SetCellStyle(sheetName, fmt.Sprintf("A%d", row), fmt.Sprintf("D%d", row), dataStyle)
			f.SetRowHeight(sheetName, row, 30)
			row++
		}
	}
}

// Helper functions
func getBorder() []excelize.Border {
	return []excelize.Border{
		{Type: "left", Color: "#000000", Style: 1},
		{Type: "top", Color: "#000000", Style: 1},
		{Type: "bottom", Color: "#000000", Style: 1},
		{Type: "right", Color: "#000000", Style: 1},
	}
}

func getMapValue(m map[string]interface{}, key string) string {
	if val, ok := m[key]; ok {
		switch v := val.(type) {
		case string:
			return v
		case float64:
			return strconv.FormatFloat(v, 'f', -1, 64)
		case int:
			return strconv.Itoa(v)
		default:
			return fmt.Sprintf("%v", v)
		}
	}
	return "-"
}

func getStringValue(obj interface{}, field string) string {
	if obj == nil {
		return "-"
	}
	// Simplified: in real code you'd use reflection or type assertion
	return "-"
}

func getIntPtrValue(val *int) string {
	if val == nil {
		return "-"
	}
	return strconv.Itoa(*val)
}
