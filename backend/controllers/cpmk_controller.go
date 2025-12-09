package controllers

import (
	"encoding/csv"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/syrlramadhan/dokumentasi-rps-api/models"
	"github.com/xuri/excelize/v2"
	"gorm.io/gorm"
)

type CPMKController struct {
	db *gorm.DB
}

func NewCPMKController(db *gorm.DB) *CPMKController {
	return &CPMKController{db: db}
}

// GetByCourseId - Get all CPMK and Sub-CPMK for a specific course
func (cc *CPMKController) GetByCourseId(c *gin.Context) {
	courseId := c.Param("course_id")

	var cpmks []models.CPMK
	if err := cc.db.Preload("SubCPMKs").Where("course_id = ?", courseId).Order("cpmk_number ASC").Find(&cpmks).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch CPMK"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    cpmks,
	})
}

// Create - Create CPMK with Sub-CPMKs
func (cc *CPMKController) Create(c *gin.Context) {
	var req struct {
		CourseID    string `json:"course_id" binding:"required"`
		CPMKNumber  int    `json:"cpmk_number" binding:"required"`
		Description string `json:"description" binding:"required"`
		SubCPMKs    []struct {
			SubCPMKNumber int    `json:"sub_cpmk_number" binding:"required"`
			Description   string `json:"description" binding:"required"`
		} `json:"sub_cpmks"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	courseUUID, err := uuid.Parse(req.CourseID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid course_id"})
		return
	}

	// Check if CPMK already exists for this course
	var existing models.CPMK
	if err := cc.db.Where("course_id = ? AND cpmk_number = ?", courseUUID, req.CPMKNumber).First(&existing).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "CPMK number already exists for this course"})
		return
	}

	// Create CPMK
	cpmk := models.CPMK{
		ID:          uuid.New(),
		CourseID:    courseUUID,
		CPMKNumber:  req.CPMKNumber,
		Description: req.Description,
	}

	if err := cc.db.Create(&cpmk).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create CPMK"})
		return
	}

	// Create Sub-CPMKs
	for _, subReq := range req.SubCPMKs {
		subCPMK := models.SubCPMK{
			ID:            uuid.New(),
			CPMKId:        cpmk.ID,
			SubCPMKNumber: subReq.SubCPMKNumber,
			Description:   subReq.Description,
		}
		if err := cc.db.Create(&subCPMK).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create Sub-CPMK"})
			return
		}
	}

	// Reload with relations
	cc.db.Preload("SubCPMKs").First(&cpmk, cpmk.ID)

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"data":    cpmk,
	})
}

// Delete - Soft delete CPMK and its Sub-CPMKs
func (cc *CPMKController) Delete(c *gin.Context) {
	cpmkId := c.Param("id")

	if err := cc.db.Delete(&models.CPMK{}, "id = ?", cpmkId).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete CPMK"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "CPMK deleted successfully",
	})
}

// DownloadTemplate - Download Excel template for CPMK import
func (cc *CPMKController) DownloadTemplate(c *gin.Context) {
	f := excelize.NewFile()
	defer f.Close()

	// Sheet 1: CPMK Template
	cpmkSheet := "CPMK Template"
	index, _ := f.NewSheet(cpmkSheet)
	f.SetActiveSheet(index)
	f.DeleteSheet("Sheet1")

	// Set column widths
	f.SetColWidth(cpmkSheet, "A", "A", 5)
	f.SetColWidth(cpmkSheet, "B", "B", 40)
	f.SetColWidth(cpmkSheet, "C", "C", 15)
	f.SetColWidth(cpmkSheet, "D", "D", 60)

	// Header style
	headerStyle, _ := f.NewStyle(&excelize.Style{
		Font:      &excelize.Font{Bold: true, Size: 12, Color: "#FFFFFF", Family: "Arial"},
		Fill:      excelize.Fill{Type: "pattern", Color: []string{"#4472C4"}, Pattern: 1},
		Alignment: &excelize.Alignment{Horizontal: "center", Vertical: "center"},
		Border: []excelize.Border{
			{Type: "left", Color: "#000000", Style: 1},
			{Type: "top", Color: "#000000", Style: 1},
			{Type: "bottom", Color: "#000000", Style: 1},
			{Type: "right", Color: "#000000", Style: 1},
		},
	})

	// Data style
	dataStyle, _ := f.NewStyle(&excelize.Style{
		Font:      &excelize.Font{Size: 11, Family: "Arial"},
		Alignment: &excelize.Alignment{Vertical: "center", WrapText: true},
		Border: []excelize.Border{
			{Type: "left", Color: "#D3D3D3", Style: 1},
			{Type: "top", Color: "#D3D3D3", Style: 1},
			{Type: "bottom", Color: "#D3D3D3", Style: 1},
			{Type: "right", Color: "#D3D3D3", Style: 1},
		},
	})

	// Set headers
	headers := []string{"NO", "NAMA MATA KULIAH", "SKS", "CPMK 1", "CPMK 2", "CPMK 3", "CPMK 4", "CPMK 5", "CPMK 6", "CPMK 7", "CPMK 8"}
	for i, header := range headers {
		cell := string(rune('A'+i)) + "1"
		f.SetCellValue(cpmkSheet, cell, header)
		f.SetCellStyle(cpmkSheet, cell, cell, headerStyle)
	}
	f.SetRowHeight(cpmkSheet, 1, 25)

	// Example data
	exampleData := [][]interface{}{
		{1, "Bahasa Indonesia", 2, "Menjelaskan kedudukan, fungsi, dan ragam Bahasa Indonesia", "Menguasai kaidah Ejaan Bahasa Indonesia (EBI)", "Menganalisis kalimat efektif", "", "", "", "", ""},
		{2, "Algoritma & Pemrograman", 3, "Memahami konsep algoritma", "Menyusun algoritma dengan flowchart", "Implementasi dengan Java", "", "", "", "", ""},
	}

	for i, row := range exampleData {
		rowNum := i + 2
		for j, value := range row {
			cell := string(rune('A'+j)) + strconv.Itoa(rowNum)
			f.SetCellValue(cpmkSheet, cell, value)
			f.SetCellStyle(cpmkSheet, cell, cell, dataStyle)
		}
		f.SetRowHeight(cpmkSheet, rowNum, 20)
	}

	// Sheet 2: Sub-CPMK Template
	subSheet := "Sub-CPMK Template"
	f.NewSheet(subSheet)

	// Sub-CPMK headers
	subHeaders := []string{"NO", "MATA KULIAH", "CPMK", "SUB CPMK 1", "SUB CPMK 2", "SUB CPMK 3", "SUB CPMK 4", "SUB CPMK 5"}
	for i, header := range subHeaders {
		cell := string(rune('A'+i)) + "1"
		f.SetCellValue(subSheet, cell, header)
		f.SetCellStyle(subSheet, cell, cell, headerStyle)
	}

	// Example Sub-CPMK data
	subExampleData := [][]interface{}{
		{1, "BAHASA INDONESIA", "Menjelaskan kedudukan, fungsi, dan ragam Bahasa Indonesia", "Mahasiswa mampu menjelaskan sejarah Bahasa Indonesia", "", "", "", ""},
	}

	for i, row := range subExampleData {
		rowNum := i + 2
		for j, value := range row {
			cell := string(rune('A'+j)) + strconv.Itoa(rowNum)
			f.SetCellValue(subSheet, cell, value)
			f.SetCellStyle(subSheet, cell, cell, dataStyle)
		}
	}

	// Instructions sheet
	instructionSheet := "Instruksi"
	f.NewSheet(instructionSheet)

	instructions := []string{
		"INSTRUKSI PENGGUNAAN TEMPLATE CPMK",
		"",
		"Sheet 1: CPMK Template",
		"- Kolom A: Nomor urut",
		"- Kolom B: Nama Mata Kuliah (harus sama persis dengan nama di sistem)",
		"- Kolom C: SKS",
		"- Kolom D-K: CPMK 1 sampai CPMK 8",
		"",
		"Sheet 2: Sub-CPMK Template",
		"- Kolom A: Nomor urut",
		"- Kolom B: Nama Mata Kuliah",
		"- Kolom C: CPMK (harus sama persis dengan CPMK di Sheet 1)",
		"- Kolom D-H: Sub-CPMK 1 sampai Sub-CPMK 5",
		"",
		"CATATAN PENTING:",
		"1. Jangan ubah nama kolom header",
		"2. Nama Mata Kuliah harus sesuai dengan data di sistem",
		"3. CPMK di Sub-CPMK sheet harus sama persis dengan CPMK di Sheet 1",
		"4. Kolom yang kosong boleh dibiarkan kosong",
		"5. Hapus contoh data sebelum mengisi data Anda",
	}

	for i, instruction := range instructions {
		cell := "A" + strconv.Itoa(i+1)
		f.SetCellValue(instructionSheet, cell, instruction)
		if i == 0 {
			titleStyle, _ := f.NewStyle(&excelize.Style{
				Font: &excelize.Font{Bold: true, Size: 14, Color: "#1F4E78"},
			})
			f.SetCellStyle(instructionSheet, cell, cell, titleStyle)
		}
	}
	f.SetColWidth(instructionSheet, "A", "A", 80)

	// Set response headers
	fileName := fmt.Sprintf("Template_CPMK_%s.xlsx", time.Now().Format("2006-01-02"))
	c.Header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
	c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=%s", fileName))
	c.Header("Content-Transfer-Encoding", "binary")

	if err := f.Write(c.Writer); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate template"})
		return
	}
}

// ImportExcel - Import CPMK and Sub-CPMK from Excel
func (cc *CPMKController) ImportExcel(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "File is required"})
		return
	}

	src, err := file.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to open file"})
		return
	}
	defer src.Close()

	f, err := excelize.OpenReader(src)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Excel format"})
		return
	}
	defer f.Close()

	imported := 0
	failed := 0
	var errors []string

	// Import CPMK from Sheet 1
	cpmkRows, err := f.GetRows("CPMK Template")
	if err != nil || len(cpmkRows) < 2 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "CPMK Template sheet not found or empty"})
		return
	}

	for i, row := range cpmkRows[1:] { // Skip header
		if len(row) < 4 {
			failed++
			errors = append(errors, fmt.Sprintf("Baris %d: Data tidak lengkap", i+2))
			continue
		}

		courseName := strings.TrimSpace(row[1])
		if courseName == "" {
			continue // Skip empty rows
		}

		// Find course by name
		var course models.Course
		if err := cc.db.Where("title = ?", courseName).First(&course).Error; err != nil {
			failed++
			errors = append(errors, fmt.Sprintf("Baris %d: Mata kuliah '%s' tidak ditemukan", i+2, courseName))
			continue
		}

		// Delete existing CPMK for this course
		cc.db.Where("course_id = ?", course.ID).Delete(&models.CPMK{})

		// Import CPMKs (columns D onwards)
		for j := 3; j < len(row) && j < 11; j++ { // Max 8 CPMKs
			cpmkDesc := strings.TrimSpace(row[j])
			if cpmkDesc == "" {
				continue
			}

			cpmk := models.CPMK{
				ID:          uuid.New(),
				CourseID:    course.ID,
				CPMKNumber:  j - 2, // CPMK 1, 2, 3, ...
				Description: cpmkDesc,
			}

			if err := cc.db.Create(&cpmk).Error; err != nil {
				failed++
				errors = append(errors, fmt.Sprintf("Baris %d: Gagal simpan CPMK %d", i+2, j-2))
				continue
			}
			imported++
		}
	}

	// Import Sub-CPMK from Sheet 2
	subRows, _ := f.GetRows("Sub-CPMK Template")
	if len(subRows) > 1 {
		for i, row := range subRows[1:] {
			if len(row) < 4 {
				continue
			}

			courseName := strings.TrimSpace(row[1])
			cpmkDesc := strings.TrimSpace(row[2])

			if courseName == "" || cpmkDesc == "" {
				continue
			}

			// Find course and CPMK
			var course models.Course
			if err := cc.db.Where("title = ?", courseName).First(&course).Error; err != nil {
				errors = append(errors, fmt.Sprintf("Sub-CPMK Baris %d: Mata kuliah tidak ditemukan", i+2))
				continue
			}

			var cpmk models.CPMK
			if err := cc.db.Where("course_id = ? AND description = ?", course.ID, cpmkDesc).First(&cpmk).Error; err != nil {
				errors = append(errors, fmt.Sprintf("Sub-CPMK Baris %d: CPMK tidak ditemukan", i+2))
				continue
			}

			// Import Sub-CPMKs
			for j := 3; j < len(row) && j < 8; j++ { // Max 5 Sub-CPMKs
				subDesc := strings.TrimSpace(row[j])
				if subDesc == "" {
					continue
				}

				subCPMK := models.SubCPMK{
					ID:            uuid.New(),
					CPMKId:        cpmk.ID,
					SubCPMKNumber: j - 2,
					Description:   subDesc,
				}

				if err := cc.db.Create(&subCPMK).Error; err != nil {
					failed++
					continue
				}
			}
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"success":        true,
		"message":        fmt.Sprintf("Import selesai: %d CPMK berhasil, %d gagal", imported, failed),
		"imported_count": imported,
		"failed_count":   failed,
		"errors":         errors,
	})
}

// ExportExcel - Export CPMK and Sub-CPMK to Excel
func (cc *CPMKController) ExportExcel(c *gin.Context) {
	courseId := c.Query("course_id")

	var courses []models.Course
	query := cc.db.Preload("Program")

	if courseId != "" {
		query = query.Where("id = ?", courseId)
	}

	if err := query.Find(&courses).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch courses"})
		return
	}

	f := excelize.NewFile()
	defer f.Close()

	sheetName := "CPMK Data"
	index, _ := f.NewSheet(sheetName)
	f.SetActiveSheet(index)
	f.DeleteSheet("Sheet1")

	// Styling
	headerStyle, _ := f.NewStyle(&excelize.Style{
		Font:      &excelize.Font{Bold: true, Size: 12, Color: "#FFFFFF", Family: "Arial"},
		Fill:      excelize.Fill{Type: "pattern", Color: []string{"#4472C4"}, Pattern: 1},
		Alignment: &excelize.Alignment{Horizontal: "center", Vertical: "center"},
		Border: []excelize.Border{
			{Type: "left", Color: "#000000", Style: 1},
			{Type: "top", Color: "#000000", Style: 1},
			{Type: "bottom", Color: "#000000", Style: 1},
			{Type: "right", Color: "#000000", Style: 1},
		},
	})

	// Headers
	headers := []string{"Mata Kuliah", "CPMK No", "CPMK Description", "Sub-CPMK No", "Sub-CPMK Description"}
	for i, header := range headers {
		cell := string(rune('A'+i)) + "1"
		f.SetCellValue(sheetName, cell, header)
		f.SetCellStyle(sheetName, cell, cell, headerStyle)
	}

	rowNum := 2
	for _, course := range courses {
		var cpmks []models.CPMK
		cc.db.Preload("SubCPMKs").Where("course_id = ?", course.ID).Order("cpmk_number ASC").Find(&cpmks)

		for _, cpmk := range cpmks {
			if len(cpmk.SubCPMKs) > 0 {
				for _, sub := range cpmk.SubCPMKs {
					f.SetCellValue(sheetName, fmt.Sprintf("A%d", rowNum), course.Title)
					f.SetCellValue(sheetName, fmt.Sprintf("B%d", rowNum), cpmk.CPMKNumber)
					f.SetCellValue(sheetName, fmt.Sprintf("C%d", rowNum), cpmk.Description)
					f.SetCellValue(sheetName, fmt.Sprintf("D%d", rowNum), sub.SubCPMKNumber)
					f.SetCellValue(sheetName, fmt.Sprintf("E%d", rowNum), sub.Description)
					rowNum++
				}
			} else {
				f.SetCellValue(sheetName, fmt.Sprintf("A%d", rowNum), course.Title)
				f.SetCellValue(sheetName, fmt.Sprintf("B%d", rowNum), cpmk.CPMKNumber)
				f.SetCellValue(sheetName, fmt.Sprintf("C%d", rowNum), cpmk.Description)
				rowNum++
			}
		}
	}

	fileName := fmt.Sprintf("CPMK_Export_%s.xlsx", time.Now().Format("2006-01-02"))
	c.Header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
	c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=%s", fileName))

	if err := f.Write(c.Writer); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate Excel"})
		return
	}
}

// ImportCSV - Import CPMK and Sub-CPMK from CSV files
func (cc *CPMKController) ImportCSV(c *gin.Context) {
	// Get uploaded files
	cpmkFile, err := c.FormFile("cpmk_file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "CPMK CSV file required"})
		return
	}

	subCpmkFile, err := c.FormFile("sub_cpmk_file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Sub-CPMK CSV file required"})
		return
	}

	// Open CPMK CSV
	cpmkFileReader, err := cpmkFile.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to open CPMK file"})
		return
	}
	defer cpmkFileReader.Close()

	// Open Sub-CPMK CSV
	subCpmkFileReader, err := subCpmkFile.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to open Sub-CPMK file"})
		return
	}
	defer subCpmkFileReader.Close()

	// Read CPMK CSV using csv.Reader
	cpmkCsvReader := csv.NewReader(cpmkFileReader)
	cpmkCsvReader.Comma = ';' // CSV uses semicolon delimiter
	cpmkCsvReader.LazyQuotes = true
	cpmkCsvReader.TrimLeadingSpace = true

	cpmkRows, err := cpmkCsvReader.ReadAll()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Failed to parse CPMK CSV: %v", err)})
		return
	}

	if len(cpmkRows) < 2 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "CPMK CSV must have header and data rows"})
		return
	}

	// Read Sub-CPMK CSV
	subCpmkCsvReader := csv.NewReader(subCpmkFileReader)
	subCpmkCsvReader.Comma = ';' // CSV uses semicolon delimiter
	subCpmkCsvReader.LazyQuotes = true
	subCpmkCsvReader.TrimLeadingSpace = true

	subCpmkRows, err := subCpmkCsvReader.ReadAll()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Failed to parse Sub-CPMK CSV: %v", err)})
		return
	}

	if len(subCpmkRows) < 2 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Sub-CPMK CSV must have header and data rows"})
		return
	}

	// Process CPMK data
	courseMap := make(map[string]uuid.UUID)
	cpmkMap := make(map[string]map[int]uuid.UUID) // courseTitle -> cpmkNumber -> cpmkID
	importedCount := 0
	failedCount := 0
	var errors []string

	// Start transaction
	tx := cc.db.Begin()

	// Process CPMK rows (skip header)
	for i, row := range cpmkRows[1:] {
		if len(row) < 4 {
			continue
		}

		courseTitle := strings.TrimSpace(row[1])
		if courseTitle == "" {
			continue
		}

		// Get or cache course ID
		courseID, exists := courseMap[courseTitle]
		if !exists {
			var course models.Course
			if err := tx.Where("title = ?", courseTitle).First(&course).Error; err != nil {
				errors = append(errors, fmt.Sprintf("Row %d: Course '%s' not found", i+2, courseTitle))
				failedCount++
				continue
			}
			courseID = course.ID
			courseMap[courseTitle] = courseID

			// Delete existing CPMK for this course
			if err := tx.Where("course_id = ?", courseID).Delete(&models.CPMK{}).Error; err != nil {
				errors = append(errors, fmt.Sprintf("Failed to delete existing CPMK for '%s'", courseTitle))
			}
		}

		// Parse CPMK data (columns D onwards are CPMK descriptions)
		if _, exists := cpmkMap[courseTitle]; !exists {
			cpmkMap[courseTitle] = make(map[int]uuid.UUID)
		}

		for cpmkNum := 1; cpmkNum <= 11; cpmkNum++ {
			colIndex := 3 + cpmkNum - 1 // Column D = index 3
			if colIndex >= len(row) {
				break
			}

			description := strings.TrimSpace(row[colIndex])
			if description == "" {
				continue
			}

			cpmk := models.CPMK{
				ID:          uuid.New(),
				CourseID:    courseID,
				CPMKNumber:  cpmkNum,
				Description: description,
			}

			if err := tx.Create(&cpmk).Error; err != nil {
				errors = append(errors, fmt.Sprintf("Row %d CPMK %d: %s", i+2, cpmkNum, err.Error()))
				failedCount++
				continue
			}

			cpmkMap[courseTitle][cpmkNum] = cpmk.ID
			importedCount++
		}
	}

	// Process Sub-CPMK rows (skip header)
	for i, row := range subCpmkRows[1:] {
		if len(row) < 4 {
			continue
		}

		courseTitle := strings.TrimSpace(row[1])
		cpmkNumStr := strings.TrimSpace(row[2])

		if courseTitle == "" || cpmkNumStr == "" {
			continue
		}

		// Parse CPMK number from string like "1). Description" or just "1"
		cpmkNumStr = strings.Split(cpmkNumStr, ")")[0]
		cpmkNumStr = strings.TrimSpace(cpmkNumStr)
		cpmkNum, err := strconv.Atoi(cpmkNumStr)
		if err != nil {
			errors = append(errors, fmt.Sprintf("Sub-CPMK Row %d: Invalid CPMK number '%s'", i+2, row[2]))
			failedCount++
			continue
		}

		// Get CPMK ID
		cpmkID, exists := cpmkMap[courseTitle][cpmkNum]
		if !exists {
			errors = append(errors, fmt.Sprintf("Sub-CPMK Row %d: CPMK %d not found for '%s'", i+2, cpmkNum, courseTitle))
			failedCount++
			continue
		}

		// Parse Sub-CPMK data (columns D onwards)
		for subNum := 1; subNum <= 14; subNum++ {
			colIndex := 3 + subNum - 1
			if colIndex >= len(row) {
				break
			}

			description := strings.TrimSpace(row[colIndex])
			if description == "" {
				continue
			}

			subCpmk := models.SubCPMK{
				ID:            uuid.New(),
				CPMKId:        cpmkID,
				SubCPMKNumber: subNum,
				Description:   description,
			}

			if err := tx.Create(&subCpmk).Error; err != nil {
				errors = append(errors, fmt.Sprintf("Sub-CPMK Row %d.%d: %s", i+2, subNum, err.Error()))
				failedCount++
				continue
			}
		}
	}

	// Commit transaction
	if err := tx.Commit().Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to commit transaction"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success":        true,
		"message":        fmt.Sprintf("Successfully imported %d CPMK items", importedCount),
		"imported_count": importedCount,
		"failed_count":   failedCount,
		"errors":         errors,
	})
}
