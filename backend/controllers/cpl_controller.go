package controllers

import (
	"fmt"
	"net/http"
	"strings"

	"smart-rps-backend/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/xuri/excelize/v2"
	"gorm.io/gorm"
)

type CPLController struct {
	db *gorm.DB
}

func NewCPLController(db *gorm.DB) *CPLController {
	return &CPLController{db: db}
}

type CreateCPLRequest struct {
	ProdiID    string   `json:"prodi_id" binding:"required"`
	KodeCPL    string   `json:"kode_cpl" binding:"required"`
	Komponen   string   `json:"komponen" binding:"required"`
	CPL        string   `json:"cpl" binding:"required"`
	Indikators []string `json:"indikators"`
}

type UpdateCPLRequest struct {
	KodeCPL    string   `json:"kode_cpl"`
	Komponen   string   `json:"komponen"`
	CPL        string   `json:"cpl"`
	Indikators []string `json:"indikators"`
}

type BatchCreateCPLRequest struct {
	ProdiID string `json:"prodi_id" binding:"required"`
	Data    []struct {
		KodeCPL    string   `json:"kode_cpl" binding:"required"`
		Komponen   string   `json:"komponen" binding:"required"`
		CPL        string   `json:"cpl" binding:"required"`
		Indikators []string `json:"indikators"`
	} `json:"data" binding:"required"`
}

// GetAll - Get all CPL with optional filtering by prodi_id
func (c *CPLController) GetAll(ctx *gin.Context) {
	prodiID := ctx.Query("prodi_id")
	search := ctx.Query("search")

	var cpls []models.CPL
	var total int64

	query := c.db.Model(&models.CPL{})

	if prodiID != "" {
		query = query.Where("prodi_id = ?", prodiID)
	}

	if search != "" {
		query = query.Where("kode_cpl ILIKE ? OR komponen ILIKE ? OR cpl ILIKE ?",
			"%"+search+"%", "%"+search+"%", "%"+search+"%")
	}

	query.Count(&total)
	query.Preload("Prodi").Preload("Indikators", func(db *gorm.DB) *gorm.DB {
		return db.Order("urutan ASC")
	}).Order("kode_cpl ASC").Find(&cpls)

	if cpls == nil {
		cpls = []models.CPL{}
	}

	ctx.JSON(http.StatusOK, gin.H{
		"data":  cpls,
		"total": total,
	})
}

// GetByID - Get CPL by ID
func (c *CPLController) GetByID(ctx *gin.Context) {
	id := ctx.Param("id")

	var cpl models.CPL
	if err := c.db.Preload("Prodi").Preload("Indikators", func(db *gorm.DB) *gorm.DB {
		return db.Order("urutan ASC")
	}).First(&cpl, "id = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "CPL not found"})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch CPL"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": cpl})
}

// GetByProdiID - Get all CPL by Prodi ID
func (c *CPLController) GetByProdiID(ctx *gin.Context) {
	prodiID := ctx.Param("prodi_id")

	var cpls []models.CPL
	if err := c.db.Where("prodi_id = ?", prodiID).Preload("Indikators", func(db *gorm.DB) *gorm.DB {
		return db.Order("urutan ASC")
	}).Order("kode_cpl ASC").Find(&cpls).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch CPL"})
		return
	}

	if cpls == nil {
		cpls = []models.CPL{}
	}

	ctx.JSON(http.StatusOK, gin.H{"data": cpls})
}

// Create - Create new CPL
func (c *CPLController) Create(ctx *gin.Context) {
	var req CreateCPLRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	prodiUUID, err := uuid.Parse(req.ProdiID)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid prodi_id format"})
		return
	}

	// Check if prodi exists
	var prodi models.Prodi
	if err := c.db.First(&prodi, "id = ?", prodiUUID).Error; err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Prodi not found"})
		return
	}

	// Check if kode_cpl already exists for this prodi
	var existing models.CPL
	if err := c.db.Where("prodi_id = ? AND kode_cpl = ? AND deleted_at IS NULL", prodiUUID, req.KodeCPL).First(&existing).Error; err == nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Kode CPL sudah ada untuk prodi ini"})
		return
	}

	cpl := models.CPL{
		ID:       uuid.New(),
		ProdiID:  prodiUUID,
		KodeCPL:  req.KodeCPL,
		Komponen: req.Komponen,
		CPL:      req.CPL,
	}

	if err := c.db.Create(&cpl).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create CPL"})
		return
	}

	// Create indikators if provided
	if len(req.Indikators) > 0 {
		for i, indikator := range req.Indikators {
			cplIndikator := models.CPLIndikator{
				ID:             uuid.New(),
				CPLID:          cpl.ID,
				IndikatorKerja: indikator,
				Urutan:         i + 1,
			}
			c.db.Create(&cplIndikator)
		}
	}

	// Reload with indikators
	c.db.Preload("Indikators", func(db *gorm.DB) *gorm.DB {
		return db.Order("urutan ASC")
	}).First(&cpl, "id = ?", cpl.ID)

	ctx.JSON(http.StatusCreated, gin.H{
		"message": "CPL berhasil ditambahkan",
		"data":    cpl,
	})
}

// BatchCreate - Create multiple CPL at once
func (c *CPLController) BatchCreate(ctx *gin.Context) {
	var req BatchCreateCPLRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	prodiUUID, err := uuid.Parse(req.ProdiID)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid prodi_id format"})
		return
	}

	// Check if prodi exists
	var prodi models.Prodi
	if err := c.db.First(&prodi, "id = ?", prodiUUID).Error; err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Prodi not found"})
		return
	}

	var createdCPLs []models.CPL
	var skipped []string

	for _, item := range req.Data {
		// Check if kode_cpl already exists
		var existing models.CPL
		if err := c.db.Where("prodi_id = ? AND kode_cpl = ? AND deleted_at IS NULL", prodiUUID, item.KodeCPL).First(&existing).Error; err == nil {
			skipped = append(skipped, item.KodeCPL)
			continue
		}

		cpl := models.CPL{
			ID:       uuid.New(),
			ProdiID:  prodiUUID,
			KodeCPL:  item.KodeCPL,
			Komponen: item.Komponen,
			CPL:      item.CPL,
		}

		if err := c.db.Create(&cpl).Error; err != nil {
			continue
		}

		// Create indikators if provided
		if len(item.Indikators) > 0 {
			for i, indikator := range item.Indikators {
				cplIndikator := models.CPLIndikator{
					ID:             uuid.New(),
					CPLID:          cpl.ID,
					IndikatorKerja: indikator,
					Urutan:         i + 1,
				}
				c.db.Create(&cplIndikator)
			}
		}

		createdCPLs = append(createdCPLs, cpl)
	}

	ctx.JSON(http.StatusCreated, gin.H{
		"message":       "Batch create completed",
		"created":       len(createdCPLs),
		"skipped":       len(skipped),
		"skipped_codes": skipped,
		"data":          createdCPLs,
	})
}

// Update - Update CPL
func (c *CPLController) Update(ctx *gin.Context) {
	id := ctx.Param("id")

	var cpl models.CPL
	if err := c.db.First(&cpl, "id = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "CPL not found"})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch CPL"})
		return
	}

	var req UpdateCPLRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if new kode_cpl already exists (if changed)
	if req.KodeCPL != "" && req.KodeCPL != cpl.KodeCPL {
		var existing models.CPL
		if err := c.db.Where("prodi_id = ? AND kode_cpl = ? AND id != ? AND deleted_at IS NULL", cpl.ProdiID, req.KodeCPL, cpl.ID).First(&existing).Error; err == nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Kode CPL sudah ada untuk prodi ini"})
			return
		}
	}

	updates := map[string]interface{}{}
	if req.KodeCPL != "" {
		updates["kode_cpl"] = req.KodeCPL
	}
	if req.Komponen != "" {
		updates["komponen"] = req.Komponen
	}
	if req.CPL != "" {
		updates["cpl"] = req.CPL
	}

	if err := c.db.Model(&cpl).Updates(updates).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update CPL"})
		return
	}

	// Update indikators if provided
	if req.Indikators != nil {
		// Delete existing indikators
		c.db.Where("cpl_id = ?", cpl.ID).Delete(&models.CPLIndikator{})

		// Create new indikators
		for i, indikator := range req.Indikators {
			cplIndikator := models.CPLIndikator{
				ID:             uuid.New(),
				CPLID:          cpl.ID,
				IndikatorKerja: indikator,
				Urutan:         i + 1,
			}
			c.db.Create(&cplIndikator)
		}
	}

	// Reload to get updated data with indikators
	c.db.Preload("Indikators", func(db *gorm.DB) *gorm.DB {
		return db.Order("urutan ASC")
	}).First(&cpl, "id = ?", id)

	ctx.JSON(http.StatusOK, gin.H{
		"message": "CPL berhasil diupdate",
		"data":    cpl,
	})
}

// Delete - Delete CPL (soft delete)
func (c *CPLController) Delete(ctx *gin.Context) {
	id := ctx.Param("id")

	var cpl models.CPL
	if err := c.db.First(&cpl, "id = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "CPL not found"})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch CPL"})
		return
	}

	if err := c.db.Delete(&cpl).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete CPL"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "CPL berhasil dihapus",
	})
}

// DownloadTemplate - Download Excel template for CPL import
func (c *CPLController) DownloadTemplate(ctx *gin.Context) {
	f := excelize.NewFile()
	defer f.Close()

	sheetName := "Template CPL"
	index, err := f.NewSheet(sheetName)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create sheet"})
		return
	}

	// Set headers
	headers := []string{"No", "Kode CPL", "Komponen", "CPL", "Indikator Kinerja 1", "Indikator Kinerja 2", "Indikator Kinerja 3", "Indikator Kinerja 4", "Indikator Kinerja 5"}
	for i, header := range headers {
		cell := string(rune('A'+i)) + "1"
		f.SetCellValue(sheetName, cell, header)
	}

	// Add example data
	example := []interface{}{
		1,
		"CPL-01",
		"Pengetahuan Umum",
		"Mampu menerapkan pengetahuan matematika untuk memahami prinsip dasar teknik",
		"Mahasiswa mampu menjelaskan konsep dasar matematika",
		"Mahasiswa mampu menerapkan prinsip fisika",
		"Mahasiswa mampu mengaplikasikan konsep ilmu alam",
		"", // Optional
		"", // Optional
	}

	for i, val := range example {
		cell := string(rune('A'+i)) + "2"
		f.SetCellValue(sheetName, cell, val)
	}

	// Style header
	headerStyle, _ := f.NewStyle(&excelize.Style{
		Font: &excelize.Font{Bold: true, Color: "FFFFFF"},
		Fill: excelize.Fill{Type: "pattern", Color: []string{"4472C4"}, Pattern: 1},
		Alignment: &excelize.Alignment{
			Horizontal: "center",
			Vertical:   "center",
		},
	})
	f.SetCellStyle(sheetName, "A1", "I1", headerStyle)

	// Set column widths
	f.SetColWidth(sheetName, "A", "A", 5)
	f.SetColWidth(sheetName, "B", "B", 12)
	f.SetColWidth(sheetName, "C", "C", 20)
	f.SetColWidth(sheetName, "D", "D", 50)
	f.SetColWidth(sheetName, "E", "I", 45)

	f.SetActiveSheet(index)
	f.DeleteSheet("Sheet1")

	// Set content type and filename
	ctx.Header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
	ctx.Header("Content-Disposition", "attachment; filename=Template_CPL.xlsx")

	if err := f.Write(ctx.Writer); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to write file"})
	}
}

// ImportExcel - Import CPL from Excel file
func (c *CPLController) ImportExcel(ctx *gin.Context) {
	prodiID := ctx.PostForm("prodi_id")
	if prodiID == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "prodi_id is required"})
		return
	}

	prodiUUID, err := uuid.Parse(prodiID)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid prodi_id format"})
		return
	}

	// Check if prodi exists
	var prodi models.Prodi
	if err := c.db.First(&prodi, "id = ?", prodiUUID).Error; err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Prodi not found"})
		return
	}

	file, err := ctx.FormFile("file")
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "File is required"})
		return
	}

	// Open uploaded file
	src, err := file.Open()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to open file"})
		return
	}
	defer src.Close()

	// Read Excel file
	f, err := excelize.OpenReader(src)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Failed to read Excel file"})
		return
	}
	defer f.Close()

	// Get first sheet
	sheets := f.GetSheetList()
	if len(sheets) == 0 {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "No sheets found in Excel file"})
		return
	}

	rows, err := f.GetRows(sheets[0])
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Failed to read rows"})
		return
	}

	if len(rows) < 2 {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Excel file is empty"})
		return
	}

	var createdCPLs []models.CPL
	var skipped []string
	var errors []string

	// Skip header row
	for i, row := range rows[1:] {
		if len(row) < 4 {
			errors = append(errors, fmt.Sprintf("Row %d: Insufficient columns", i+2))
			continue
		}

		// Skip empty rows
		if strings.TrimSpace(row[1]) == "" {
			continue
		}

		kodeCPL := strings.TrimSpace(row[1])
		komponen := strings.TrimSpace(row[2])
		cplDesc := strings.TrimSpace(row[3])

		// Collect indikators (columns 4-8)
		var indikators []string
		for j := 4; j < len(row) && j < 9; j++ {
			indikator := strings.TrimSpace(row[j])
			if indikator != "" {
				indikators = append(indikators, indikator)
			}
		}

		// Check if kode_cpl already exists
		var existing models.CPL
		if err := c.db.Where("prodi_id = ? AND kode_cpl = ? AND deleted_at IS NULL", prodiUUID, kodeCPL).First(&existing).Error; err == nil {
			skipped = append(skipped, kodeCPL)
			continue
		}

		// Create CPL
		cpl := models.CPL{
			ID:       uuid.New(),
			ProdiID:  prodiUUID,
			KodeCPL:  kodeCPL,
			Komponen: komponen,
			CPL:      cplDesc,
		}

		if err := c.db.Create(&cpl).Error; err != nil {
			errors = append(errors, fmt.Sprintf("Row %d (%s): %v", i+2, kodeCPL, err))
			continue
		}

		// Create indikators
		for idx, indikator := range indikators {
			cplIndikator := models.CPLIndikator{
				ID:             uuid.New(),
				CPLID:          cpl.ID,
				IndikatorKerja: indikator,
				Urutan:         idx + 1,
			}
			c.db.Create(&cplIndikator)
		}

		createdCPLs = append(createdCPLs, cpl)
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Import completed",
		"created": len(createdCPLs),
		"skipped": len(skipped),
		"errors":  len(errors),
		"details": gin.H{
			"skipped_codes": skipped,
			"error_details": errors,
		},
	})
}

// ExportExcel - Export CPL to Excel file
func (c *CPLController) ExportExcel(ctx *gin.Context) {
	prodiID := ctx.Query("prodi_id")
	if prodiID == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "prodi_id is required"})
		return
	}

	prodiUUID, err := uuid.Parse(prodiID)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid prodi_id format"})
		return
	}

	// Get prodi info
	var prodi models.Prodi
	if err := c.db.First(&prodi, "id = ?", prodiUUID).Error; err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Prodi not found"})
		return
	}

	// Get all CPL for this prodi
	var cpls []models.CPL
	if err := c.db.Where("prodi_id = ? AND deleted_at IS NULL", prodiUUID).
		Preload("Indikators", func(db *gorm.DB) *gorm.DB {
			return db.Order("urutan ASC")
		}).
		Order("kode_cpl ASC").
		Find(&cpls).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch CPL"})
		return
	}

	if len(cpls) == 0 {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "No CPL found for this prodi"})
		return
	}

	// Create Excel file
	f := excelize.NewFile()
	defer f.Close()

	sheetName := "CPL"
	index, err := f.NewSheet(sheetName)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create sheet"})
		return
	}

	// Set headers
	headers := []string{"No", "Kode CPL", "Komponen", "CPL", "Indikator Kinerja 1", "Indikator Kinerja 2", "Indikator Kinerja 3", "Indikator Kinerja 4", "Indikator Kinerja 5"}
	for i, header := range headers {
		cell := string(rune('A'+i)) + "1"
		f.SetCellValue(sheetName, cell, header)
	}

	// Style header
	headerStyle, _ := f.NewStyle(&excelize.Style{
		Font: &excelize.Font{Bold: true, Color: "FFFFFF"},
		Fill: excelize.Fill{Type: "pattern", Color: []string{"4472C4"}, Pattern: 1},
		Alignment: &excelize.Alignment{
			Horizontal: "center",
			Vertical:   "center",
		},
	})
	f.SetCellStyle(sheetName, "A1", "I1", headerStyle)

	// Fill data
	for i, cpl := range cpls {
		rowNum := i + 2
		f.SetCellValue(sheetName, fmt.Sprintf("A%d", rowNum), i+1)
		f.SetCellValue(sheetName, fmt.Sprintf("B%d", rowNum), cpl.KodeCPL)
		f.SetCellValue(sheetName, fmt.Sprintf("C%d", rowNum), cpl.Komponen)
		f.SetCellValue(sheetName, fmt.Sprintf("D%d", rowNum), cpl.CPL)

		// Add indikators
		for j, indikator := range cpl.Indikators {
			if j < 5 { // Max 5 indikators
				colNum := rune('E' + j)
				f.SetCellValue(sheetName, fmt.Sprintf("%c%d", colNum, rowNum), indikator.IndikatorKerja)
			}
		}
	}

	// Set column widths
	f.SetColWidth(sheetName, "A", "A", 5)
	f.SetColWidth(sheetName, "B", "B", 12)
	f.SetColWidth(sheetName, "C", "C", 20)
	f.SetColWidth(sheetName, "D", "D", 50)
	f.SetColWidth(sheetName, "E", "I", 45)

	// Apply text wrap for long columns
	wrapStyle, _ := f.NewStyle(&excelize.Style{
		Alignment: &excelize.Alignment{
			WrapText: true,
			Vertical: "top",
		},
	})
	lastRow := len(cpls) + 1
	f.SetCellStyle(sheetName, "D2", fmt.Sprintf("I%d", lastRow), wrapStyle)

	f.SetActiveSheet(index)
	f.DeleteSheet("Sheet1")

	// Generate filename with prodi name
	filename := fmt.Sprintf("CPL_%s_%s.xlsx", prodi.KodeProdi, prodi.NamaProdi)
	filename = strings.ReplaceAll(filename, " ", "_")

	// Set content type and filename
	ctx.Header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
	ctx.Header("Content-Disposition", fmt.Sprintf("attachment; filename=%s", filename))

	if err := f.Write(ctx.Writer); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to write file"})
	}
}
