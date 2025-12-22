package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"smart-rps-backend/models"

	"github.com/gin-gonic/gin"
	"github.com/xuri/excelize/v2"
)

// ExportExcel exports RPS to Excel format
func (gc *GeneratedRPSController) ExportExcel(c *gin.Context) {
	rpsID := c.Param("id")

	var rps models.GeneratedRPS
	err := gc.db.
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

// createCPMKSheet creates the CPMK sheet
func createCPMKSheet(f *excelize.File, result map[string]interface{}) {
	sheetName := "CPMK & Sub-CPMK"
	f.NewSheet(sheetName)

	// Set column widths
	f.SetColWidth(sheetName, "A", "A", 8)
	f.SetColWidth(sheetName, "B", "B", 15)
	f.SetColWidth(sheetName, "C", "C", 60)
	f.SetColWidth(sheetName, "D", "D", 8)

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

	// === SECTION 1: CPL (Capaian Pembelajaran Lulusan) ===
	f.SetCellValue(sheetName, fmt.Sprintf("A%d", row), "CAPAIAN PEMBELAJARAN LULUSAN (CPL)")
	f.MergeCell(sheetName, fmt.Sprintf("A%d", row), fmt.Sprintf("D%d", row))
	f.SetCellStyle(sheetName, fmt.Sprintf("A%d", row), fmt.Sprintf("D%d", row), titleStyle)
	f.SetRowHeight(sheetName, row, 25)
	row++

	// CPL Headers
	cplHeaders := []string{"No", "Kode CPL", "Deskripsi CPL", "Komponen"}
	for i, header := range cplHeaders {
		cell := string(rune('A'+i)) + fmt.Sprintf("%d", row)
		f.SetCellValue(sheetName, cell, header)
		f.SetCellStyle(sheetName, cell, cell, headerStyle)
	}
	f.SetRowHeight(sheetName, row, 25)
	row++

	// CPL Data
	if cplData, ok := result["cpl"].([]interface{}); ok {
		for i, cpl := range cplData {
			if cplMap, ok := cpl.(map[string]interface{}); ok {
				f.SetCellValue(sheetName, fmt.Sprintf("A%d", row), i+1)
				f.SetCellValue(sheetName, fmt.Sprintf("B%d", row), getMapValue(cplMap, "code"))
				f.SetCellValue(sheetName, fmt.Sprintf("C%d", row), getMapValue(cplMap, "description"))
				f.SetCellValue(sheetName, fmt.Sprintf("D%d", row), getMapValue(cplMap, "komponen"))

				f.SetCellStyle(sheetName, fmt.Sprintf("A%d", row), fmt.Sprintf("D%d", row), dataStyle)
				f.SetRowHeight(sheetName, row, 30)
				row++
			}
		}
	}

	// Empty row
	row++

	// === SECTION 2: CPMK (Capaian Pembelajaran Mata Kuliah) ===
	f.SetCellValue(sheetName, fmt.Sprintf("A%d", row), "CAPAIAN PEMBELAJARAN MATA KULIAH (CPMK)")
	f.MergeCell(sheetName, fmt.Sprintf("A%d", row), fmt.Sprintf("D%d", row))
	f.SetCellStyle(sheetName, fmt.Sprintf("A%d", row), fmt.Sprintf("D%d", row), titleStyle)
	f.SetRowHeight(sheetName, row, 25)
	row++

	// CPMK Headers
	headers := []string{"No", "Kode CPMK", "Deskripsi", "Bobot"}
	for i, header := range headers {
		cell := string(rune('A'+i)) + fmt.Sprintf("%d", row)
		f.SetCellValue(sheetName, cell, header)
		f.SetCellStyle(sheetName, cell, cell, headerStyle)
	}
	f.SetRowHeight(sheetName, row, 25)
	row++

	// CPMK Data
	if cpmkData, ok := result["cpmk"].([]interface{}); ok {
		for i, cpmk := range cpmkData {
			if cpmkMap, ok := cpmk.(map[string]interface{}); ok {
				f.SetCellValue(sheetName, fmt.Sprintf("A%d", row), i+1)
				f.SetCellValue(sheetName, fmt.Sprintf("B%d", row), getMapValue(cpmkMap, "code"))
				f.SetCellValue(sheetName, fmt.Sprintf("C%d", row), getMapValue(cpmkMap, "description"))
				f.SetCellValue(sheetName, fmt.Sprintf("D%d", row), getMapValue(cpmkMap, "bobot"))

				f.SetCellStyle(sheetName, fmt.Sprintf("A%d", row), fmt.Sprintf("D%d", row), dataStyle)
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

	// Sub-CPMK Data
	row := 2
	no := 1
	if cpmkData, ok := result["cpmk"].([]interface{}); ok {
		for _, cpmk := range cpmkData {
			if cpmkMap, ok := cpmk.(map[string]interface{}); ok {
				// Get sub_cpmk array
				if subCpmkList, ok := cpmkMap["sub_cpmk"].([]interface{}); ok {
					for _, subCpmk := range subCpmkList {
						if subMap, ok := subCpmk.(map[string]interface{}); ok {
							f.SetCellValue(sheetName, fmt.Sprintf("A%d", row), no)
							f.SetCellValue(sheetName, fmt.Sprintf("B%d", row), getMapValue(subMap, "code"))
							f.SetCellValue(sheetName, fmt.Sprintf("C%d", row), getMapValue(subMap, "description"))
							f.SetCellValue(sheetName, fmt.Sprintf("D%d", row), getMapValue(subMap, "bobot"))

							f.SetCellStyle(sheetName, fmt.Sprintf("A%d", row), fmt.Sprintf("D%d", row), dataStyle)
							f.SetRowHeight(sheetName, row, 30)
							row++
							no++
						}
					}
				}
			}
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

	// Weekly plan data
	row := 2
	if rencanaMingguan, ok := result["rencana_mingguan"].([]interface{}); ok {
		for _, minggu := range rencanaMingguan {
			if mingguMap, ok := minggu.(map[string]interface{}); ok {
				f.SetCellValue(sheetName, fmt.Sprintf("A%d", row), getMapValue(mingguMap, "minggu"))
				f.SetCellValue(sheetName, fmt.Sprintf("B%d", row), getMapValue(mingguMap, "topik_materi"))
				f.SetCellValue(sheetName, fmt.Sprintf("C%d", row), getMapValue(mingguMap, "metode_pembelajaran"))
				f.SetCellValue(sheetName, fmt.Sprintf("D%d", row), getMapValue(mingguMap, "indikator"))
				f.SetCellValue(sheetName, fmt.Sprintf("E%d", row), getMapValue(mingguMap, "waktu"))

				f.SetCellStyle(sheetName, fmt.Sprintf("A%d", row), fmt.Sprintf("E%d", row), dataStyle)
				f.SetRowHeight(sheetName, row, 35)
				row++
			}
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

	// Task data
	row := 2
	if tugasData, ok := result["rencana_tugas"].([]interface{}); ok {
		for i, tugas := range tugasData {
			if tugasMap, ok := tugas.(map[string]interface{}); ok {
				f.SetCellValue(sheetName, fmt.Sprintf("A%d", row), i+1)
				f.SetCellValue(sheetName, fmt.Sprintf("B%d", row), getMapValue(tugasMap, "judul"))
				f.SetCellValue(sheetName, fmt.Sprintf("C%d", row), getMapValue(tugasMap, "batas_waktu"))
				f.SetCellValue(sheetName, fmt.Sprintf("D%d", row), getMapValue(tugasMap, "petunjuk"))
				f.SetCellValue(sheetName, fmt.Sprintf("E%d", row), getMapValue(tugasMap, "kriteria_penilaian"))
				f.SetCellValue(sheetName, fmt.Sprintf("F%d", row), getMapValue(tugasMap, "bobot_persen"))

				f.SetCellStyle(sheetName, fmt.Sprintf("A%d", row), fmt.Sprintf("F%d", row), dataStyle)
				f.SetRowHeight(sheetName, row, 40)
				row++
			}
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

	// Assessment data
	row := 2
	if analisisPenilaian, ok := result["analisis_penilaian"].([]interface{}); ok {
		for _, penilaian := range analisisPenilaian {
			if penilaianMap, ok := penilaian.(map[string]interface{}); ok {
				f.SetCellValue(sheetName, fmt.Sprintf("A%d", row), getMapValue(penilaianMap, "minggu"))
				f.SetCellValue(sheetName, fmt.Sprintf("B%d", row), getMapValue(penilaianMap, "topik_materi"))
				f.SetCellValue(sheetName, fmt.Sprintf("C%d", row), getMapValue(penilaianMap, "jenis_assessment"))
				f.SetCellValue(sheetName, fmt.Sprintf("D%d", row), getMapValue(penilaianMap, "bobot"))

				f.SetCellStyle(sheetName, fmt.Sprintf("A%d", row), fmt.Sprintf("D%d", row), dataStyle)
				f.SetRowHeight(sheetName, row, 30)
				row++
			}
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
