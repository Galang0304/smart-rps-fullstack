package controllers

import (
	"net/http"

	"smart-rps-backend/models"
	"smart-rps-backend/services"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type DosenController struct {
	db           *gorm.DB
	emailService *services.EmailService
}

func NewDosenController(db *gorm.DB) *DosenController {
	return &DosenController{
		db:           db,
		emailService: services.NewEmailService(),
	}
}

type CreateDosenRequest struct {
	UserID            *string `json:"user_id"`
	ProdiID           *string `json:"prodi_id"`
	NamaLengkap       string  `json:"nama_lengkap" binding:"required"`
	Email             string  `json:"email" binding:"required,email"`
	NoTelepon         string  `json:"no_telepon"`
	JabatanFungsional string  `json:"jabatan_fungsional"`
	Username          string  `json:"username"`
	Password          string  `json:"password"`
	IsActive          *bool   `json:"is_active"`
}

// GetAll - Get all dosens
func (dc *DosenController) GetAll(c *gin.Context) {
	var dosens []models.Dosen
	var total int64

	// Build query
	query := dc.db.Model(&models.Dosen{})

	// Filter by prodi_id if provided
	prodiID := c.Query("prodi_id")
	if prodiID != "" {
		query = query.Where("prodi_id = ?", prodiID)
	}

	// Filter by search (nama_lengkap, email)
	search := c.Query("search")
	if search != "" {
		query = query.Where("nama_lengkap ILIKE ? OR email ILIKE ?",
			"%"+search+"%", "%"+search+"%")
	}

	// Count total with filters
	query.Count(&total)

	// Execute query with preloads
	if err := query.Preload("User").Preload("Prodi").Find(&dosens).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Gagal mengambil data dosen",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"data": dosens,
			"pagination": gin.H{
				"total_items":  total,
				"total_pages":  1,
				"current_page": 1,
				"per_page":     total,
			},
		},
	})
}

// GetByID - Get dosen by ID
func (dc *DosenController) GetByID(c *gin.Context) {
	id := c.Param("id")
	dosenID, err := uuid.Parse(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid ID",
			"message": "ID dosen tidak valid",
		})
		return
	}

	var dosen models.Dosen
	if err := dc.db.Preload("User").Preload("Prodi").First(&dosen, "id = ?", dosenID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"error":   "Not found",
				"message": "Dosen tidak ditemukan",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Gagal mengambil data dosen",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    dosen,
	})
}

// Create - Create new dosen
func (dc *DosenController) Create(c *gin.Context) {
	var req CreateDosenRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid request",
			"message": err.Error(),
		})
		return
	}

	var userID, prodiID *uuid.UUID
	if req.UserID != nil && *req.UserID != "" {
		id, err := uuid.Parse(*req.UserID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error":   "Invalid user ID",
				"message": "User ID tidak valid",
			})
			return
		}
		userID = &id
	}

	if req.ProdiID != nil && *req.ProdiID != "" {
		id, err := uuid.Parse(*req.ProdiID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error":   "Invalid prodi ID",
				"message": "Prodi ID tidak valid",
			})
			return
		}
		prodiID = &id
	}

	isActive := true
	if req.IsActive != nil {
		isActive = *req.IsActive
	}

	// Create user account for dosen if username and password provided
	if userID == nil && req.Username != "" && req.Password != "" {
		// Check if username already exists
		var existingUser models.User
		if err := dc.db.Where("username = ?", req.Username).First(&existingUser).Error; err == nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error":   "Username already exists",
				"message": "Username '" + req.Username + "' sudah digunakan. Pilih username lain.",
			})
			return
		}

		// Hash password
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "Password hash error",
				"message": "Gagal mengenkripsi password",
			})
			return
		}

		// Create user
		newUserID := uuid.New()
		user := models.User{
			ID:          newUserID,
			Username:    req.Username,
			Password:    string(hashedPassword),
			Email:       req.Email,
			DisplayName: req.NamaLengkap,
			Role:        "dosen",
		}

		if err := dc.db.Create(&user).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "Database error",
				"message": "Gagal membuat user account: " + err.Error(),
			})
			return
		}

		userID = &newUserID
	}

	// Set default empty string for NIDN to satisfy NOT NULL constraint
	emptyNIDN := ""

	dosen := models.Dosen{
		ID:                uuid.New(),
		UserID:            userID,
		ProdiID:           prodiID,
		NIDN:              &emptyNIDN,
		NamaLengkap:       req.NamaLengkap,
		Email:             req.Email,
		NoTelepon:         req.NoTelepon,
		JabatanFungsional: req.JabatanFungsional,
		IsActive:          isActive,
	}

	if err := dc.db.Create(&dosen).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Gagal membuat dosen baru",
		})
		return
	}

	// Send email notification if user account was created
	if userID != nil && req.Username != "" && req.Password != "" {
		go func() {
			err := dc.emailService.SendDosenAccountEmail(
				req.Email,
				req.NamaLengkap,
				req.Username,
				req.Password,
			)
			if err != nil {
				// Log error but don't fail the request
				println("Warning: Failed to send email:", err.Error())
			}
		}()
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Dosen berhasil dibuat. Email notifikasi telah dikirim ke " + req.Email,
		"data":    dosen,
	})
}

// Update - Update dosen
func (dc *DosenController) Update(c *gin.Context) {
	id := c.Param("id")
	dosenID, err := uuid.Parse(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid ID",
			"message": "ID dosen tidak valid",
		})
		return
	}

	var dosen models.Dosen
	if err := dc.db.First(&dosen, "id = ?", dosenID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"error":   "Not found",
				"message": "Dosen tidak ditemukan",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Gagal mengambil data dosen",
		})
		return
	}

	var req CreateDosenRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid request",
			"message": err.Error(),
		})
		return
	}

	// Parse ProdiID if provided
	if req.ProdiID != nil && *req.ProdiID != "" {
		prodiID, err := uuid.Parse(*req.ProdiID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error":   "Invalid prodi ID",
				"message": "Prodi ID tidak valid",
			})
			return
		}
		dosen.ProdiID = &prodiID
	}

	dosen.NamaLengkap = req.NamaLengkap
	dosen.Email = req.Email
	dosen.NoTelepon = req.NoTelepon
	dosen.JabatanFungsional = req.JabatanFungsional
	if req.IsActive != nil {
		dosen.IsActive = *req.IsActive
	}

	if err := dc.db.Save(&dosen).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Gagal mengupdate dosen",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Dosen berhasil diupdate",
		"data":    dosen,
	})
}

// Delete - Delete dosen (soft delete) and associated user account
func (dc *DosenController) Delete(c *gin.Context) {
	id := c.Param("id")
	dosenID, err := uuid.Parse(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid ID",
			"message": "ID dosen tidak valid",
		})
		return
	}

	// Get dosen first to get user_id
	var dosen models.Dosen
	if err := dc.db.First(&dosen, "id = ?", dosenID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"error":   "Not found",
				"message": "Dosen tidak ditemukan",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Gagal mengambil data dosen",
		})
		return
	}

	// Start transaction
	tx := dc.db.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	// Delete dosen (soft delete)
	if err := tx.Delete(&models.Dosen{}, "id = ?", dosenID).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Gagal menghapus dosen",
		})
		return
	}

	// Delete associated user account if exists
	if dosen.UserID != nil {
		if err := tx.Delete(&models.User{}, "id = ?", dosen.UserID).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "Database error",
				"message": "Gagal menghapus user account",
			})
			return
		}
	}

	// Commit transaction
	if err := tx.Commit().Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Gagal commit transaction",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Dosen dan akun user berhasil dihapus",
	})
}

type AssignCoursesRequest struct {
	CourseIDs []string `json:"course_ids" binding:"required"`
}

// AssignCourses - Assign courses to dosen
func (dc *DosenController) AssignCourses(c *gin.Context) {
	id := c.Param("id")
	dosenID, err := uuid.Parse(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid ID",
			"message": "ID dosen tidak valid",
		})
		return
	}

	var dosen models.Dosen
	if err := dc.db.Preload("Courses").First(&dosen, "id = ?", dosenID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"error":   "Not found",
				"message": "Dosen tidak ditemukan",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Gagal mengambil data dosen",
		})
		return
	}

	var req AssignCoursesRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid request",
			"message": err.Error(),
		})
		return
	}

	// Parse course IDs
	var courses []models.Course
	for _, idStr := range req.CourseIDs {
		courseID, err := uuid.Parse(idStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error":   "Invalid course ID",
				"message": "ID mata kuliah tidak valid: " + idStr,
			})
			return
		}

		var course models.Course
		if err := dc.db.First(&course, "id = ?", courseID).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{
				"error":   "Not found",
				"message": "Mata kuliah tidak ditemukan: " + idStr,
			})
			return
		}
		courses = append(courses, course)
	}

	// Replace courses (clear old assignments and add new ones)
	if err := dc.db.Model(&dosen).Association("Courses").Replace(courses); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Gagal mengassign mata kuliah",
		})
		return
	}

	// Send email notification
	if len(courses) > 0 {
		courseNames := make([]string, len(courses))
		for i, course := range courses {
			courseNames[i] = course.Title
		}

		go func() {
			err := dc.emailService.SendCourseAssignmentEmail(
				dosen.Email,
				dosen.NamaLengkap,
				courseNames,
			)
			if err != nil {
				println("Warning: Failed to send email:", err.Error())
			}
		}()
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Mata kuliah berhasil diassign",
		"data":    courses,
	})
}

// GetDosenCourses - Get courses assigned to dosen
func (dc *DosenController) GetDosenCourses(c *gin.Context) {
	id := c.Param("id")
	dosenID, err := uuid.Parse(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid ID",
			"message": "ID dosen tidak valid",
		})
		return
	}

	var dosen models.Dosen
	if err := dc.db.Preload("Courses.Program").First(&dosen, "id = ?", dosenID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"error":   "Not found",
				"message": "Dosen tidak ditemukan",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Gagal mengambil data dosen",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    dosen.Courses,
	})
}
