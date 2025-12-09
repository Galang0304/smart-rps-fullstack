package controllers

import (
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/syrlramadhan/dokumentasi-rps-api/models"
	"github.com/xuri/excelize/v2"
)

// DownloadTemplate - Download Excel template for course import
func (cc *CourseController) DownloadTemplate(c *gin.Context) {
	f := excelize.NewFile()
	defer f.Close()

	sheetName := "Template Mata Kuliah"
	index, _ := f.NewSheet(sheetName)
	f.SetActiveSheet(index)
	f.DeleteSheet("Sheet1")

	// Set column widths
	f.SetColWidth(sheetName, "A", "A", 5)
	f.SetColWidth(sheetName, "B", "B", 15)
	f.SetColWidth(sheetName, "C", "C", 40)
	f.SetColWidth(sheetName, "D", "D", 8)
	f.SetColWidth(sheetName, "E", "E", 10)
	f.SetColWidth(sheetName, "F", "F", 10)

	// Create header style
	headerStyle, _ := f.NewStyle(&excelize.Style{
		Font: &excelize.Font{
			Bold:   true,
			Size:   12,
			Color:  "#FFFFFF",
			Family: "Arial",
		},
		Fill: excelize.Fill{
			Type:    "pattern",
			Color:   []string{"#4472C4"},
			Pattern: 1,
		},
		Alignment: &excelize.Alignment{
			Horizontal: "center",
			Vertical:   "center",
		},
		Border: []excelize.Border{
			{Type: "left", Color: "#000000", Style: 1},
			{Type: "top", Color: "#000000", Style: 1},
			{Type: "bottom", Color: "#000000", Style: 1},
			{Type: "right", Color: "#000000", Style: 1},
		},
	})

	// Create data style
	dataStyle, _ := f.NewStyle(&excelize.Style{
		Font: &excelize.Font{
			Size:   11,
			Family: "Arial",
		},
		Alignment: &excelize.Alignment{
			Vertical: "center",
			WrapText: true,
		},
		Border: []excelize.Border{
			{Type: "left", Color: "#D3D3D3", Style: 1},
			{Type: "top", Color: "#D3D3D3", Style: 1},
			{Type: "bottom", Color: "#D3D3D3", Style: 1},
			{Type: "right", Color: "#D3D3D3", Style: 1},
		},
	})

	// Set headers
	headers := []string{"No", "Kode MK", "Mata Kuliah", "SKS", "Semester", "Tahun"}
	for i, header := range headers {
		cell := string(rune('A'+i)) + "1"
		f.SetCellValue(sheetName, cell, header)
		f.SetCellStyle(sheetName, cell, cell, headerStyle)
	}

	// Set row height for header
	f.SetRowHeight(sheetName, 1, 25)

	// Add example data
	exampleData := [][]interface{}{
		{1, "AW60910042101", "Pendidikan Pancasila", 2, 1, strconv.Itoa(time.Now().Year())},
		{2, "AW60910042103", "Bahasa Indonesia", 2, 1, strconv.Itoa(time.Now().Year())},
		{3, "AW60910042104", "Bahasa Inggris", 2, 1, strconv.Itoa(time.Now().Year())},
	}

	for i, row := range exampleData {
		rowNum := i + 2
		for j, value := range row {
			cell := string(rune('A'+j)) + strconv.Itoa(rowNum)
			f.SetCellValue(sheetName, cell, value)
			f.SetCellStyle(sheetName, cell, cell, dataStyle)
		}
		f.SetRowHeight(sheetName, rowNum, 20)
	}

	// Add instructions sheet
	instructionSheet := "Instruksi"
	f.NewSheet(instructionSheet)

	instructions := []string{
		"INSTRUKSI PENGGUNAAN TEMPLATE MATA KULIAH",
		"",
		"1. Jangan mengubah nama kolom di sheet 'Template Mata Kuliah'",
		"2. Kolom yang wajib diisi:",
		"   - Kode MK: Kode mata kuliah (contoh: AW60910042101)",
		"   - Mata Kuliah: Nama mata kuliah",
		"   - SKS: Satuan Kredit Semester (angka)",
		"   - Semester: Semester (angka 1-8)",
		"   - Tahun: Tahun akademik (contoh: 2025, 2024, 2026)",
		"",
		"3. Hapus baris contoh data sebelum mengisi data Anda",
		"4. Pastikan tidak ada baris kosong di tengah data",
		"5. Format file yang diunggah harus .xlsx",
		"",
		"6. Contoh pengisian:",
		"   No  | Kode MK        | Mata Kuliah           | SKS | Semester | Tahun",
		"   1   | AW60910042101  | Pendidikan Pancasila  | 2   | 1        | 2025",
		"   2   | CW65520223103  | Matematika Informatika| 3   | 2        | 2025",
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
	fileName := fmt.Sprintf("Template_Mata_Kuliah_%s.xlsx", time.Now().Format("2006-01-02"))
	c.Header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
	c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=%s", fileName))
	c.Header("Content-Transfer-Encoding", "binary")

	// Write to response
	if err := f.Write(c.Writer); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate template"})
		return
	}
}

// ImportExcel - Import courses from Excel file
func (cc *CourseController) ImportExcel(c *gin.Context) {
	// Get program_id from form data
	programIDStr := c.PostForm("program_id")
	if programIDStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "program_id is required"})
		return
	}

	// Parse program_id - could be prodi_id, need to get program_id from prodi
	var programID uuid.UUID
	var prodi models.Prodi

	// Try to find prodi by id
	if err := cc.db.First(&prodi, "id = ?", programIDStr).Error; err == nil {
		// It's a prodi_id, get the program_id
		if prodi.ProgramID == nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Prodi belum terhubung dengan Program. Silakan hubungi admin."})
			return
		}
		programID = *prodi.ProgramID
	} else {
		// Try to parse as program_id directly
		parsedID, err := uuid.Parse(programIDStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid program_id format"})
			return
		}
		programID = parsedID
	}

	// Get uploaded file
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "File is required"})
		return
	}

	// Open file
	src, err := file.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to open file"})
		return
	}
	defer src.Close()

	// Read Excel file
	f, err := excelize.OpenReader(src)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Excel format"})
		return
	}
	defer f.Close()

	// Get the first sheet
	sheetName := f.GetSheetName(0)
	rows, err := f.GetRows(sheetName)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to read Excel data"})
		return
	}

	// Check if file has data
	if len(rows) < 2 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Excel file is empty"})
		return
	}

	imported := 0
	failed := 0
	var errors []string

	// Process each row (skip header)
	for i, row := range rows[1:] {
		if len(row) < 6 {
			failed++
			errors = append(errors, fmt.Sprintf("Baris %d: kolom tidak lengkap (minimal 6 kolom)", i+2))
			continue
		}

		// Parse data: No, Kode MK, Mata Kuliah, SKS, Semester, Tahun
		code := strings.TrimSpace(row[1])
		title := strings.TrimSpace(row[2])
		creditsStr := strings.TrimSpace(row[3])
		semesterStr := strings.TrimSpace(row[4])
		tahun := strings.TrimSpace(row[5])

		// Validate required fields
		if code == "" || title == "" {
			failed++
			errors = append(errors, fmt.Sprintf("Baris %d: Kode MK atau Mata Kuliah kosong", i+2))
			continue
		}

		// Parse numbers
		credits, err := strconv.Atoi(creditsStr)
		if err != nil {
			failed++
			errors = append(errors, fmt.Sprintf("Baris %d: SKS harus berupa angka", i+2))
			continue
		}

		semester, err := strconv.Atoi(semesterStr)
		if err != nil {
			failed++
			errors = append(errors, fmt.Sprintf("Baris %d: Semester harus berupa angka", i+2))
			continue
		}

		// Default tahun to current year if empty
		if tahun == "" {
			tahun = strconv.Itoa(time.Now().Year())
		}

		// Check if course already exists for that year
		var existingCourse models.Course
		if err := cc.db.Where("code = ? AND program_id = ? AND tahun = ?", code, programID, tahun).First(&existingCourse).Error; err == nil {
			failed++
			errors = append(errors, fmt.Sprintf("Baris %d: Mata kuliah '%s' tahun %s sudah ada", i+2, code, tahun))
			continue
		}

		// Create course
		course := models.Course{
			ID:        uuid.New(),
			ProgramID: &programID,
			Code:      code,
			Title:     title,
			Credits:   &credits,
			Semester:  &semester,
			Tahun:     tahun,
		}

		if err := cc.db.Create(&course).Error; err != nil {
			failed++
			errors = append(errors, fmt.Sprintf("Baris %d: Gagal menyimpan mata kuliah '%s'", i+2, code))
			continue
		}

		imported++
	}

	c.JSON(http.StatusOK, gin.H{
		"success":        true,
		"message":        fmt.Sprintf("Import selesai: %d berhasil, %d gagal", imported, failed),
		"imported_count": imported,
		"failed_count":   failed,
		"errors":         errors,
	})
}

// ExportExcel - Export courses to Excel file
func (cc *CourseController) ExportExcel(c *gin.Context) {
	programIDStr := c.Query("program_id")
	if programIDStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "program_id is required"})
		return
	}

	// Parse program_id - could be prodi_id
	var programID uuid.UUID
	var prodiName string
	var prodi models.Prodi

	// Try to find prodi by id
	if err := cc.db.Preload("Program").First(&prodi, "id = ?", programIDStr).Error; err == nil {
		if prodi.ProgramID == nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Prodi belum terhubung dengan Program"})
			return
		}
		programID = *prodi.ProgramID
		prodiName = prodi.NamaProdi
	} else {
		parsedID, err := uuid.Parse(programIDStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid program_id format"})
			return
		}
		programID = parsedID
		prodiName = "Semua Program Studi"
	}

	// Get courses
	var courses []models.Course
	if err := cc.db.Where("program_id = ?", programID).Order("tahun DESC, semester ASC, code ASC").Find(&courses).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch courses"})
		return
	}

	// Create Excel file
	f := excelize.NewFile()
	defer f.Close()

	sheetName := "Daftar Mata Kuliah"
	index, _ := f.NewSheet(sheetName)
	f.SetActiveSheet(index)
	f.DeleteSheet("Sheet1")

	// Set column widths
	f.SetColWidth(sheetName, "A", "A", 5)
	f.SetColWidth(sheetName, "B", "B", 15)
	f.SetColWidth(sheetName, "C", "C", 40)
	f.SetColWidth(sheetName, "D", "D", 8)
	f.SetColWidth(sheetName, "E", "E", 10)
	f.SetColWidth(sheetName, "F", "F", 10)

	// Create title style
	titleStyle, _ := f.NewStyle(&excelize.Style{
		Font: &excelize.Font{
			Bold:   true,
			Size:   14,
			Color:  "#1F4E78",
			Family: "Arial",
		},
		Alignment: &excelize.Alignment{
			Horizontal: "center",
			Vertical:   "center",
		},
	})

	// Create header style
	headerStyle, _ := f.NewStyle(&excelize.Style{
		Font: &excelize.Font{
			Bold:   true,
			Size:   12,
			Color:  "#FFFFFF",
			Family: "Arial",
		},
		Fill: excelize.Fill{
			Type:    "pattern",
			Color:   []string{"#4472C4"},
			Pattern: 1,
		},
		Alignment: &excelize.Alignment{
			Horizontal: "center",
			Vertical:   "center",
		},
		Border: []excelize.Border{
			{Type: "left", Color: "#000000", Style: 1},
			{Type: "top", Color: "#000000", Style: 1},
			{Type: "bottom", Color: "#000000", Style: 1},
			{Type: "right", Color: "#000000", Style: 1},
		},
	})

	// Create data style
	dataStyle, _ := f.NewStyle(&excelize.Style{
		Font: &excelize.Font{
			Size:   11,
			Family: "Arial",
		},
		Alignment: &excelize.Alignment{
			Vertical: "center",
			WrapText: true,
		},
		Border: []excelize.Border{
			{Type: "left", Color: "#D3D3D3", Style: 1},
			{Type: "top", Color: "#D3D3D3", Style: 1},
			{Type: "bottom", Color: "#D3D3D3", Style: 1},
			{Type: "right", Color: "#D3D3D3", Style: 1},
		},
	})

	// Add title
	f.MergeCell(sheetName, "A1", "F1")
	f.SetCellValue(sheetName, "A1", fmt.Sprintf("DAFTAR MATA KULIAH - %s", strings.ToUpper(prodiName)))
	f.SetCellStyle(sheetName, "A1", "F1", titleStyle)
	f.SetRowHeight(sheetName, 1, 30)

	// Add subtitle
	subtitleStyle, _ := f.NewStyle(&excelize.Style{
		Font:      &excelize.Font{Size: 10, Color: "#666666", Family: "Arial"},
		Alignment: &excelize.Alignment{Horizontal: "center"},
	})
	f.MergeCell(sheetName, "A2", "F2")
	f.SetCellValue(sheetName, "A2", fmt.Sprintf("Diekspor pada: %s", time.Now().Format("02 January 2006 15:04")))
	f.SetCellStyle(sheetName, "A2", "F2", subtitleStyle)
	f.SetRowHeight(sheetName, 2, 20)

	// Set headers
	headers := []string{"No", "Kode MK", "Mata Kuliah", "SKS", "Semester", "Tahun"}
	for i, header := range headers {
		cell := string(rune('A'+i)) + "4"
		f.SetCellValue(sheetName, cell, header)
		f.SetCellStyle(sheetName, cell, cell, headerStyle)
	}
	f.SetRowHeight(sheetName, 4, 25)

	// Add data
	for i, course := range courses {
		rowNum := i + 5
		credits := 0
		semester := 0
		if course.Credits != nil {
			credits = *course.Credits
		}
		if course.Semester != nil {
			semester = *course.Semester
		}

		data := []interface{}{
			i + 1,
			course.Code,
			course.Title,
			credits,
			semester,
			course.Tahun,
		}

		for j, value := range data {
			cell := string(rune('A'+j)) + strconv.Itoa(rowNum)
			f.SetCellValue(sheetName, cell, value)
			f.SetCellStyle(sheetName, cell, cell, dataStyle)
		}
		f.SetRowHeight(sheetName, rowNum, 20)
	}

	// Add summary at the bottom
	summaryRow := len(courses) + 6
	f.MergeCell(sheetName, fmt.Sprintf("A%d", summaryRow), fmt.Sprintf("F%d", summaryRow))
	f.SetCellValue(sheetName, fmt.Sprintf("A%d", summaryRow), fmt.Sprintf("Total: %d Mata Kuliah", len(courses)))
	summaryStyle, _ := f.NewStyle(&excelize.Style{
		Font:      &excelize.Font{Bold: true, Size: 11},
		Alignment: &excelize.Alignment{Horizontal: "right"},
	})
	f.SetCellStyle(sheetName, fmt.Sprintf("A%d", summaryRow), fmt.Sprintf("F%d", summaryRow), summaryStyle)

	// Set response headers
	fileName := fmt.Sprintf("Mata_Kuliah_%s_%s.xlsx", strings.ReplaceAll(prodiName, " ", "_"), time.Now().Format("2006-01-02"))
	c.Header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
	c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=%s", fileName))
	c.Header("Content-Transfer-Encoding", "binary")

	// Write to response
	if err := f.Write(c.Writer); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate Excel file"})
		return
	}
}
