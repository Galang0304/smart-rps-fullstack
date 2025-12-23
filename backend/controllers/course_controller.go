package controllers

import (
	"encoding/csv"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	"smart-rps-backend/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type CourseController struct {
	db *gorm.DB
}

func NewCourseController(db *gorm.DB) *CourseController {
	return &CourseController{db: db}
}

// GetAll - Get all courses
func (cc *CourseController) GetAll(c *gin.Context) {
	var courses []models.Course
	var total int64

	// Count total
	cc.db.Model(&models.Course{}).Count(&total)

	if err := cc.db.Preload("Program").Find(&courses).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Gagal mengambil data mata kuliah",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"data": courses,
			"pagination": gin.H{
				"total_items":  total,
				"total_pages":  1,
				"current_page": 1,
				"per_page":     total,
			},
		},
	})
}

// GetByProgramId - Get courses by program ID (actually accepts prodi_id from frontend)
// Also includes common courses assigned to this prodi
func (cc *CourseController) GetByProgramId(c *gin.Context) {
	prodiIdStr := c.Param("id")

	// Parse prodi_id to UUID
	prodiID, err := uuid.Parse(prodiIdStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid prodi_id format"})
		return
	}

	// Convert prodi_id to program_id
	var prodi models.Prodi
	if err := cc.db.First(&prodi, "id = ?", prodiID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Program studi tidak ditemukan"})
		return
	}

	var courses []models.Course

	// Get program-specific courses (non-common)
	if prodi.ProgramID != nil {
		programID := *prodi.ProgramID
		cc.db.Where("program_id = ? AND (is_common = ? OR is_common IS NULL)", programID, false).
			Preload("Program").
			Find(&courses)
	}

	// Get common courses assigned to this prodi
	var commonCourseIDs []uuid.UUID
	cc.db.Model(&models.CourseProdiAssign{}).
		Where("prodi_id = ?", prodiID).
		Pluck("course_id", &commonCourseIDs)

	if len(commonCourseIDs) > 0 {
		var commonCourses []models.Course
		cc.db.Where("id IN ? AND is_common = ?", commonCourseIDs, true).
			Find(&commonCourses)
		courses = append(courses, commonCourses...)
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"data": courses,
		},
	})
}

// GetById - Get course by ID
func (cc *CourseController) GetById(c *gin.Context) {
	id := c.Param("id")

	var course models.Course
	if err := cc.db.Preload("Program").First(&course, "id = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Course not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch course"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    course,
	})
}

// Create - Create new course
func (cc *CourseController) Create(c *gin.Context) {
	var req struct {
		ProgramID string `json:"program_id" binding:"required"`
		Code      string `json:"code" binding:"required"`
		Title     string `json:"title" binding:"required"`
		Credits   int    `json:"credits"`
		Semester  int    `json:"semester"`
		Tahun     string `json:"tahun" binding:"required"`
		Category  string `json:"category"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Parse program_id to UUID (actually this is prodi_id from frontend)
	prodiIDStr := req.ProgramID
	prodiID, err := uuid.Parse(prodiIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid prodi_id format"})
		return
	}

	// Convert prodi_id to program_id
	var prodi models.Prodi
	if err := cc.db.First(&prodi, "id = ?", prodiID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Program studi tidak ditemukan"})
		return
	}

	if prodi.ProgramID == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Program studi belum memiliki program"})
		return
	}

	programID := *prodi.ProgramID

	// Check if course code already exists for the same year
	var existingCourse models.Course
	if err := cc.db.Where("code = ? AND program_id = ? AND tahun = ?", req.Code, programID, req.Tahun).First(&existingCourse).Error; err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Kode mata kuliah '" + req.Code + "' untuk tahun " + req.Tahun + " sudah ada"})
		return
	}

	// Create course
	course := models.Course{
		ID:        uuid.New(),
		ProgramID: &programID,
		Code:      req.Code,
		Title:     req.Title,
		Credits:   &req.Credits,
		Semester:  &req.Semester,
		Tahun:     req.Tahun,
	}

	if err := cc.db.Create(&course).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create course"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Course created successfully",
		"data":    course,
	})
}

// Update - Update course
func (cc *CourseController) Update(c *gin.Context) {
	id := c.Param("id")

	var course models.Course
	if err := cc.db.First(&course, "id = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Course not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch course"})
		return
	}

	var req struct {
		Code     string `json:"code"`
		Title    string `json:"title"`
		Credits  int    `json:"credits"`
		Semester int    `json:"semester"`
		Tahun    string `json:"tahun"`
		Category string `json:"category"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Update fields
	if req.Code != "" {
		course.Code = req.Code
	}
	if req.Title != "" {
		course.Title = req.Title
	}
	if req.Credits > 0 {
		course.Credits = &req.Credits
	}
	if req.Semester > 0 {
		course.Semester = &req.Semester
	}
	if req.Tahun != "" {
		course.Tahun = req.Tahun
	}

	if err := cc.db.Save(&course).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update course"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Course updated successfully",
		"data":    course,
	})
}

// Delete - Delete course permanently (hard delete)
func (cc *CourseController) Delete(c *gin.Context) {
	id := c.Param("id")

	var course models.Course
	if err := cc.db.First(&course, "id = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Course not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch course"})
		return
	}

	// Hard delete (permanent) - use Unscoped() to bypass soft delete
	// This will also cascade delete related CPMK and Sub-CPMK if foreign keys are set correctly
	if err := cc.db.Unscoped().Delete(&course).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete course"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Course deleted successfully"})
}

// ImportCSV - Import courses from CSV file
func (cc *CourseController) ImportCSV(c *gin.Context) {
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

	// Parse CSV
	reader := csv.NewReader(src)
	records, err := reader.ReadAll()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid CSV format"})
		return
	}

	// Skip header row
	if len(records) < 2 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "CSV file is empty"})
		return
	}

	imported := 0
	failed := 0
	var errors []string

	// Process each row (skip header)
	for i, record := range records[1:] {
		if len(record) < 5 {
			failed++
			errors = append(errors, fmt.Sprintf("Row %d: insufficient columns", i+2))
			continue
		}

		// Parse data: No,Kode MK,Mata Kuliah,SKS,Semester,Tahun
		code := strings.TrimSpace(record[1])
		title := strings.TrimSpace(record[2])
		credits, _ := strconv.Atoi(strings.TrimSpace(record[3]))
		semester, _ := strconv.Atoi(strings.TrimSpace(record[4]))
		tahun := strings.TrimSpace(record[5])
		if tahun == "" {
			tahun = strconv.Itoa(time.Now().Year())
		}

		// Check if course already exists for that year
		var existingCourse models.Course
		if err := cc.db.Where("code = ? AND program_id = ? AND tahun = ?", code, programID, tahun).First(&existingCourse).Error; err == nil {
			failed++
			errors = append(errors, fmt.Sprintf("Row %d: Course '%s' for year %s already exists", i+2, code, tahun))
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
			errors = append(errors, fmt.Sprintf("Row %d: Failed to create course '%s'", i+2, code))
			continue
		}

		imported++
	}

	c.JSON(http.StatusOK, gin.H{
		"message":        fmt.Sprintf("Import completed: %d success, %d failed", imported, failed),
		"imported_count": imported,
		"failed_count":   failed,
		"errors":         errors,
	})
}
