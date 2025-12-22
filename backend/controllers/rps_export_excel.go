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
	createInfoSheet(f, &rps, dosens)
	createCPMKSheet(f, result)
	createRencanaSheet(f, result)
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
func createInfoSheet(f *excelize.File, rps *models.GeneratedRPS, dosens []models.Dosen) {
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

	// Headers
	headers := []string{"No", "Kode CPMK", "Deskripsi", "Bobot"}
	for i, header := range headers {
		cell := string(rune('A'+i)) + "1"
		f.SetCellValue(sheetName, cell, header)
		f.SetCellStyle(sheetName, cell, cell, headerStyle)
	}
	f.SetRowHeight(sheetName, 1, 25)

	// CPMK Data
	row := 2
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
