package controllers

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/syrlramadhan/dokumentasi-rps-api/models"
	"github.com/syrlramadhan/dokumentasi-rps-api/services"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type ProdiController struct {
	db           *gorm.DB
	emailService *services.EmailService
}

func NewProdiController(db *gorm.DB) *ProdiController {
	return &ProdiController{
		db:           db,
		emailService: services.NewEmailService(),
	}
}

type CreateProdiRequest struct {
	ProgramID    *string `json:"program_id"`
	KodeProdi    string  `json:"kode_prodi" binding:"required"`
	NamaProdi    string  `json:"nama_prodi" binding:"required"`
	Fakultas     string  `json:"fakultas" binding:"required"`
	Jenjang      string  `json:"jenjang" binding:"required"`
	EmailKaprodi string  `json:"email_kaprodi" binding:"required,email"`
	NamaKaprodi  string  `json:"nama_kaprodi" binding:"required"`
	Username     string  `json:"username" binding:"required"`
	Password     string  `json:"password" binding:"required"`
}

type UpdateProdiRequest struct {
	ProgramID    *string `json:"program_id"`
	KodeProdi    string  `json:"kode_prodi"`
	NamaProdi    string  `json:"nama_prodi"`
	Fakultas     string  `json:"fakultas"`
	Jenjang      string  `json:"jenjang"`
	EmailKaprodi string  `json:"email_kaprodi"`
	NamaKaprodi  string  `json:"nama_kaprodi"`
	IsActive     *bool   `json:"is_active"`
}

// GetAll - Get all prodis with pagination
func (pc *ProdiController) GetAll(c *gin.Context) {
	search := c.Query("search")

	var prodis []models.Prodi
	var total int64

	query := pc.db.Preload("User").Preload("Program")

	if search != "" {
		query = query.Where("kode_prodi ILIKE ? OR nama_prodi ILIKE ?",
			"%"+search+"%", "%"+search+"%")
	}

	query.Model(&models.Prodi{}).Count(&total)
	query.Find(&prodis)

	c.JSON(http.StatusOK, gin.H{
		"data":  prodis,
		"total": total,
	})
}

// GetAllActive - Get all active prodis
func (pc *ProdiController) GetAllActive(c *gin.Context) {
	var prodis []models.Prodi

	if err := pc.db.Preload("Program").Where("is_active = ?", true).Find(&prodis).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch active prodis"})
		return
	}

	// Ensure we return an empty array instead of null
	if prodis == nil {
		prodis = []models.Prodi{}
	}

	c.JSON(http.StatusOK, gin.H{
		"data": prodis,
	})
}

// GetByID - Get prodi by ID
func (pc *ProdiController) GetByID(c *gin.Context) {
	id := c.Param("id")

	var prodi models.Prodi
	if err := pc.db.Preload("Program").First(&prodi, "id = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Prodi not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch prodi"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": prodi})
}

// Create - Create new prodi with kaprodi user
func (pc *ProdiController) Create(c *gin.Context) {
	var req CreateProdiRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if username already exists (only check active users, not soft-deleted)
	var existingUser models.User
	if err := pc.db.Where("username = ? AND deleted_at IS NULL", req.Username).First(&existingUser).Error; err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Username '" + req.Username + "' sudah digunakan. Silakan gunakan username lain."})
		return
	}

	// Check if email already exists (only check active users, not soft-deleted)
	if err := pc.db.Where("email = ? AND deleted_at IS NULL", req.EmailKaprodi).First(&existingUser).Error; err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email '" + req.EmailKaprodi + "' sudah digunakan. Silakan gunakan email lain."})
		return
	}

	// Check if kode_prodi already exists (only check active prodi, not soft-deleted)
	var existingProdi models.Prodi
	if err := pc.db.Where("kode_prodi = ? AND deleted_at IS NULL", req.KodeProdi).First(&existingProdi).Error; err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Kode prodi '" + req.KodeProdi + "' sudah digunakan"})
		return
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	// Create user for kaprodi
	user := models.User{
		ID:          uuid.New(),
		Username:    req.Username,
		Password:    string(hashedPassword),
		Email:       &req.EmailKaprodi,
		DisplayName: &req.NamaKaprodi,
		Role:        "kaprodi",
	}

	// Start transaction
	tx := pc.db.Begin()

	if err := tx.Create(&user).Error; err != nil {
		tx.Rollback()
		// Check if error is duplicate key violation
		if strings.Contains(err.Error(), "duplicate key") || strings.Contains(err.Error(), "unique constraint") {
			if strings.Contains(err.Error(), "username") {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Username '" + req.Username + "' sudah digunakan. Silakan gunakan username lain."})
			} else if strings.Contains(err.Error(), "email") {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Email '" + req.EmailKaprodi + "' sudah digunakan. Silakan gunakan email lain."})
			} else {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Data sudah ada dalam sistem"})
			}
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user: " + err.Error()})
		}
		return
	}

	// Create prodi
	var programID *uuid.UUID
	if req.ProgramID != nil && *req.ProgramID != "" {
		parsedID, err := uuid.Parse(*req.ProgramID)
		if err == nil {
			programID = &parsedID
		}
	}

	prodi := models.Prodi{
		ID:           uuid.New(),
		UserID:       &user.ID,
		ProgramID:    programID,
		KodeProdi:    req.KodeProdi,
		NamaProdi:    req.NamaProdi,
		Fakultas:     req.Fakultas,
		Jenjang:      req.Jenjang,
		EmailKaprodi: req.EmailKaprodi,
		NamaKaprodi:  req.NamaKaprodi,
		IsActive:     true,
	}

	if err := tx.Create(&prodi).Error; err != nil {
		tx.Rollback()
		if strings.Contains(err.Error(), "duplicate key") && strings.Contains(err.Error(), "kode_prodi") {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Kode prodi '" + req.KodeProdi + "' sudah digunakan"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create prodi: " + err.Error()})
		}
		return
	}

	tx.Commit()

	// Kirim email ke Kaprodi dengan detail akun
	go func() {
		if err := pc.emailService.SendKaprodiAccountEmail(
			req.EmailKaprodi,
			req.NamaKaprodi,
			req.Username,
			req.Password,
		); err != nil {
			println("Warning: Failed to send kaprodi account email:", err.Error())
		}
	}()

	c.JSON(http.StatusCreated, gin.H{
		"message": "Prodi dan akun kaprodi berhasil dibuat",
		"data":    prodi,
	})
}

// Update - Update prodi
func (pc *ProdiController) Update(c *gin.Context) {
	id := c.Param("id")

	var prodi models.Prodi
	if err := pc.db.First(&prodi, "id = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Prodi not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch prodi"})
		return
	}

	var req UpdateProdiRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Update fields
	if req.ProgramID != nil && *req.ProgramID != "" {
		parsedID, err := uuid.Parse(*req.ProgramID)
		if err == nil {
			prodi.ProgramID = &parsedID
		}
	}
	if req.KodeProdi != "" {
		prodi.KodeProdi = req.KodeProdi
	}
	if req.NamaProdi != "" {
		prodi.NamaProdi = req.NamaProdi
	}
	if req.Fakultas != "" {
		prodi.Fakultas = req.Fakultas
	}
	if req.Jenjang != "" {
		prodi.Jenjang = req.Jenjang
	}
	if req.EmailKaprodi != "" {
		prodi.EmailKaprodi = req.EmailKaprodi
	}
	if req.NamaKaprodi != "" {
		prodi.NamaKaprodi = req.NamaKaprodi
	}
	if req.IsActive != nil {
		prodi.IsActive = *req.IsActive
	}

	if err := pc.db.Save(&prodi).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update prodi"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Prodi updated successfully",
		"data":    prodi,
	})
}

// Delete - Soft delete prodi
func (pc *ProdiController) Delete(c *gin.Context) {
	id := c.Param("id")

	var prodi models.Prodi
	if err := pc.db.First(&prodi, "id = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Prodi not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch prodi"})
		return
	}

	// Check if prodi has a user
	if prodi.UserID == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Prodi ini belum memiliki akun user"})
		return
	}

	// Start transaction
	tx := pc.db.Begin()

	// Soft delete the user first
	if err := tx.Delete(&models.User{}, "id = ?", prodi.UserID).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete user"})
		return
	}

	// Soft delete the prodi
	if err := tx.Delete(&prodi).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete prodi"})
		return
	}

	tx.Commit()

	c.JSON(http.StatusOK, gin.H{"message": "Prodi dan akun kaprodi berhasil dihapus"})
}
