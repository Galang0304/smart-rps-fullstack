package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"smart-rps-backend/models"
	"gorm.io/gorm"
)

type ProgramController struct {
	db *gorm.DB
}

func NewProgramController(db *gorm.DB) *ProgramController {
	return &ProgramController{db: db}
}

// GetAll - Get all programs with pagination
func (pc *ProgramController) GetAll(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	perPage, _ := strconv.Atoi(c.DefaultQuery("per_page", "10"))
	search := c.Query("search")
	prodiID := c.Query("prodi_id")

	var programs []models.Program
	var total int64

	query := pc.db.Model(&models.Program{})

	// Filter by prodi_id if provided
	if prodiID != "" {
		if prodiUUID, err := uuid.Parse(prodiID); err == nil {
			query = query.Where("prodi_id = ?", prodiUUID)
		}
	}

	// Search filter
	if search != "" {
		query = query.Where("name ILIKE ? OR code ILIKE ?", "%"+search+"%", "%"+search+"%")
	}

	// Count total
	query.Count(&total)

	// Calculate pagination
	offset := (page - 1) * perPage
	totalPages := int((total + int64(perPage) - 1) / int64(perPage))

	// Get programs
	if err := query.Offset(offset).Limit(perPage).Order("created_at DESC").Find(&programs).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Database error",
			"message": "Gagal mengambil data program studi",
		})
		return
	}

	// Load prodi data for each program (find prodi where program_id matches)
	type ProgramWithProdi struct {
		models.Program
		Prodi *models.Prodi `json:"prodi,omitempty"`
	}

	programsWithProdi := make([]ProgramWithProdi, len(programs))
	for i, program := range programs {
		programsWithProdi[i].Program = program

		// Find prodi that has this program_id
		var prodi models.Prodi
		if err := pc.db.Where("program_id = ?", program.ID).First(&prodi).Error; err == nil {
			programsWithProdi[i].Prodi = &prodi
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"data": programsWithProdi,
			"pagination": gin.H{
				"total_items":  total,
				"total_pages":  totalPages,
				"current_page": page,
				"per_page":     perPage,
			},
		},
	})
}

// GetByID - Get program by ID
func (pc *ProgramController) GetByID(c *gin.Context) {
	id := c.Param("id")

	programID, err := uuid.Parse(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Invalid ID format",
			"message": "Format ID tidak valid",
		})
		return
	}

	var program models.Program
	if err := pc.db.Preload("Prodi").First(&program, "id = ?", programID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error":   "Not found",
				"message": "Program studi tidak ditemukan",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Database error",
			"message": "Gagal mengambil data program studi",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    program,
	})
}

// Create - Create new program
func (pc *ProgramController) Create(c *gin.Context) {
	var input struct {
		ProdiID *string `json:"prodi_id"`
		Code    string  `json:"code" binding:"required"`
		Name    string  `json:"name" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Validation error",
			"message": "Data tidak valid: " + err.Error(),
		})
		return
	}

	// Check if code already exists
	var existing models.Program
	if err := pc.db.Where("code = ?", input.Code).First(&existing).Error; err == nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Duplicate code",
			"message": "Kode program studi sudah digunakan",
		})
		return
	}

	program := models.Program{
		Code: input.Code,
		Name: input.Name,
	}

	// Parse prodi_id if provided
	if input.ProdiID != nil && *input.ProdiID != "" {
		prodiUUID, err := uuid.Parse(*input.ProdiID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"error":   "Invalid prodi_id",
				"message": "Format prodi_id tidak valid",
			})
			return
		}

		// Verify prodi exists
		var prodi models.Prodi
		if err := pc.db.First(&prodi, "id = ?", prodiUUID).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"error":   "Prodi not found",
				"message": "Prodi tidak ditemukan",
			})
			return
		}

		program.ProdiID = &prodiUUID
	}

	if err := pc.db.Create(&program).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Database error",
			"message": "Gagal membuat program studi",
		})
		return
	}

	// Reload with relations
	pc.db.Preload("Prodi").First(&program, "id = ?", program.ID)

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Program studi berhasil dibuat",
		"data":    program,
	})
}

// Update - Update program
func (pc *ProgramController) Update(c *gin.Context) {
	id := c.Param("id")

	programID, err := uuid.Parse(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Invalid ID format",
			"message": "Format ID tidak valid",
		})
		return
	}

	var input struct {
		ProdiID *string `json:"prodi_id"`
		Code    string  `json:"code"`
		Name    string  `json:"name"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Validation error",
			"message": "Data tidak valid: " + err.Error(),
		})
		return
	}

	var program models.Program
	if err := pc.db.First(&program, "id = ?", programID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error":   "Not found",
				"message": "Program studi tidak ditemukan",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Database error",
			"message": "Gagal mengambil data program studi",
		})
		return
	}

	// Check if code is being changed and already exists
	if input.Code != "" && input.Code != program.Code {
		var existing models.Program
		if err := pc.db.Where("code = ? AND id != ?", input.Code, programID).First(&existing).Error; err == nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"error":   "Duplicate code",
				"message": "Kode program studi sudah digunakan",
			})
			return
		}
		program.Code = input.Code
	}

	if input.Name != "" {
		program.Name = input.Name
	}

	// Update prodi_id if provided
	if input.ProdiID != nil {
		if *input.ProdiID == "" {
			program.ProdiID = nil
		} else {
			prodiUUID, err := uuid.Parse(*input.ProdiID)
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{
					"success": false,
					"error":   "Invalid prodi_id",
					"message": "Format prodi_id tidak valid",
				})
				return
			}

			// Verify prodi exists
			var prodi models.Prodi
			if err := pc.db.First(&prodi, "id = ?", prodiUUID).Error; err != nil {
				c.JSON(http.StatusBadRequest, gin.H{
					"success": false,
					"error":   "Prodi not found",
					"message": "Prodi tidak ditemukan",
				})
				return
			}

			program.ProdiID = &prodiUUID
		}
	}

	if err := pc.db.Save(&program).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Database error",
			"message": "Gagal mengupdate program studi",
		})
		return
	}

	// Reload with relations
	pc.db.Preload("Prodi").First(&program, "id = ?", program.ID)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Program studi berhasil diupdate",
		"data":    program,
	})
}

// Delete - Delete program (soft delete)
func (pc *ProgramController) Delete(c *gin.Context) {
	id := c.Param("id")

	programID, err := uuid.Parse(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Invalid ID format",
			"message": "Format ID tidak valid",
		})
		return
	}

	var program models.Program
	if err := pc.db.First(&program, "id = ?", programID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error":   "Not found",
				"message": "Program studi tidak ditemukan",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Database error",
			"message": "Gagal mengambil data program studi",
		})
		return
	}

	if err := pc.db.Delete(&program).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Database error",
			"message": "Gagal menghapus program studi",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Program studi berhasil dihapus",
	})
}
