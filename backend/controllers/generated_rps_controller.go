package controllers

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"smart-rps-backend/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type GeneratedRPSController struct {
	db *gorm.DB
}

func NewGeneratedRPSController(db *gorm.DB) *GeneratedRPSController {
	return &GeneratedRPSController{db: db}
}

// Create - Create new RPS
func (gc *GeneratedRPSController) Create(c *gin.Context) {
	var input struct {
		CourseID *uuid.UUID  `json:"course_id"`
		Result   interface{} `json:"result"`
		Status   string      `json:"status"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		log.Printf("ERROR Create RPS - Failed to bind JSON: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Convert result to JSON bytes
	resultBytes, err := json.Marshal(input.Result)
	if err != nil {
		log.Printf("ERROR Create RPS - Failed to marshal result: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid result format"})
		return
	}

	log.Printf("Create RPS - CourseID: %v, Status: %s, Result: %s", input.CourseID, input.Status, string(resultBytes))

	// Jika Result kosong, set ke empty JSON object
	if len(resultBytes) == 0 || string(resultBytes) == "null" {
		resultBytes = []byte("{}")
	}

	rps := models.GeneratedRPS{
		CourseID: input.CourseID,
		Result:   resultBytes,
		Status:   input.Status,
	}

	if rps.Status == "" {
		rps.Status = "draft"
	}

	if err := gc.db.Create(&rps).Error; err != nil {
		log.Printf("ERROR Create RPS - Failed to create in DB: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create RPS"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"success": true, "data": rps})
}

// GetByID - Get RPS by ID
func (gc *GeneratedRPSController) GetByID(c *gin.Context) {
	id := c.Param("id")
	rpsUUID, err := uuid.Parse(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	var rps models.GeneratedRPS
	if err := gc.db.Preload("Course").First(&rps, "id = ?", rpsUUID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "RPS not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": rps})
}

// GetByCourseId - Get RPS by Course ID
func (gc *GeneratedRPSController) GetByCourseId(c *gin.Context) {
	courseId := c.Param("courseId")
	courseUUID, err := uuid.Parse(courseId)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid course ID format"})
		return
	}

	var rps models.GeneratedRPS
	if err := gc.db.Preload("Course").Where("course_id = ?", courseUUID).First(&rps).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "RPS not found for this course"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "data": rps})
}

// GetAll - Get all RPS
func (gc *GeneratedRPSController) GetAll(c *gin.Context) {
	var rpsList []models.GeneratedRPS

	// Get pagination parameters
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "10"))

	// Calculate offset
	offset := (page - 1) * pageSize

	// Get total count
	var total int64
	gc.db.Model(&models.GeneratedRPS{}).Count(&total)

	// Get paginated results
	if err := gc.db.Preload("Course").Offset(offset).Limit(pageSize).Find(&rpsList).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch RPS list"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": rpsList,
		"pagination": gin.H{
			"page":        page,
			"page_size":   pageSize,
			"total":       total,
			"total_pages": (total + int64(pageSize) - 1) / int64(pageSize),
		},
	})
}

// Update - Update RPS
func (gc *GeneratedRPSController) Update(c *gin.Context) {
	id := c.Param("id")
	rpsUUID, err := uuid.Parse(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	var rps models.GeneratedRPS
	if err := gc.db.First(&rps, "id = ?", rpsUUID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "RPS not found"})
		return
	}

	var input struct {
		Result interface{} `json:"result"`
		Status string      `json:"status"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if input.Result != nil {
		resultBytes, err := json.Marshal(input.Result)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid result format"})
			return
		}
		rps.Result = resultBytes
		log.Printf("Update RPS - Result: %s", string(resultBytes))
	}
	if input.Status != "" {
		rps.Status = input.Status
	}

	if err := gc.db.Save(&rps).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update RPS"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "data": rps})
}

// Delete - Delete RPS
func (gc *GeneratedRPSController) Delete(c *gin.Context) {
	id := c.Param("id")
	rpsUUID, err := uuid.Parse(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	if err := gc.db.Delete(&models.GeneratedRPS{}, "id = ?", rpsUUID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete RPS"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "RPS deleted successfully"})
}
