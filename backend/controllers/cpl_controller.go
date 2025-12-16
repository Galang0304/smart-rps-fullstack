package controllers

import (
	"net/http"

	"smart-rps-backend/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type CPLController struct {
	db *gorm.DB
}

func NewCPLController(db *gorm.DB) *CPLController {
	return &CPLController{db: db}
}

type CreateCPLRequest struct {
	ProdiID   string `json:"prodi_id" binding:"required"`
	KodeCPL   string `json:"kode_cpl" binding:"required"`
	Komponen  string `json:"komponen" binding:"required"`
	Deskripsi string `json:"deskripsi" binding:"required"`
}

type UpdateCPLRequest struct {
	KodeCPL   string `json:"kode_cpl"`
	Komponen  string `json:"komponen"`
	Deskripsi string `json:"deskripsi"`
}

type BatchCreateCPLRequest struct {
	ProdiID string `json:"prodi_id" binding:"required"`
	Data    []struct {
		KodeCPL   string `json:"kode_cpl" binding:"required"`
		Komponen  string `json:"komponen" binding:"required"`
		Deskripsi string `json:"deskripsi" binding:"required"`
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
		query = query.Where("kode_cpl ILIKE ? OR komponen ILIKE ? OR deskripsi ILIKE ?",
			"%"+search+"%", "%"+search+"%", "%"+search+"%")
	}

	query.Count(&total)
	query.Preload("Prodi").Order("kode_cpl ASC").Find(&cpls)

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
	if err := c.db.Preload("Prodi").First(&cpl, "id = ?", id).Error; err != nil {
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
	if err := c.db.Where("prodi_id = ?", prodiID).Order("kode_cpl ASC").Find(&cpls).Error; err != nil {
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
		ID:        uuid.New(),
		ProdiID:   prodiUUID,
		KodeCPL:   req.KodeCPL,
		Komponen:  req.Komponen,
		Deskripsi: req.Deskripsi,
	}

	if err := c.db.Create(&cpl).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create CPL"})
		return
	}

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
			ID:        uuid.New(),
			ProdiID:   prodiUUID,
			KodeCPL:   item.KodeCPL,
			Komponen:  item.Komponen,
			Deskripsi: item.Deskripsi,
		}

		if err := c.db.Create(&cpl).Error; err != nil {
			continue
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
	if req.Deskripsi != "" {
		updates["deskripsi"] = req.Deskripsi
	}

	if err := c.db.Model(&cpl).Updates(updates).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update CPL"})
		return
	}

	// Reload to get updated data
	c.db.First(&cpl, "id = ?", id)

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
