package controllers

import (
	"net/http"

	"smart-rps-backend/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type CommonCourseController struct {
	db *gorm.DB
}

func NewCommonCourseController(db *gorm.DB) *CommonCourseController {
	return &CommonCourseController{db: db}
}

// GetCommonCourses - Get all common courses with their assignments
func (cc *CommonCourseController) GetCommonCourses(c *gin.Context) {
	var courses []models.Course

	if err := cc.db.Where("is_common = ?", true).
		Preload("AssignedProdis.Prodi").
		Find(&courses).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to get common courses",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    courses,
	})
}

// CreateCommonCourse - Create a new common course
func (cc *CommonCourseController) CreateCommonCourse(c *gin.Context) {
	var input struct {
		Code     string      `json:"code" binding:"required"`
		Title    string      `json:"title" binding:"required"`
		Credits  *int        `json:"credits"`
		Semester *int        `json:"semester"`
		Tahun    string      `json:"tahun"`
		ProdiIDs []uuid.UUID `json:"prodi_ids"` // Array of prodi IDs to assign
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid input",
			"error":   err.Error(),
		})
		return
	}

	// Check if course with same code already exists
	var existingCourse models.Course
	if err := cc.db.Where("code = ?", input.Code).First(&existingCourse).Error; err == nil {
		// Course already exists - return conflict error with clear message
		c.JSON(http.StatusConflict, gin.H{
			"success": false,
			"message": "Kode mata kuliah sudah digunakan",
			"error":   "Kode '" + input.Code + "' sudah ada di database. Gunakan kode lain atau hapus mata kuliah yang sudah ada.",
		})
		return
	}

	// Start transaction
	tx := cc.db.Begin()

	// Create course with is_common = true
	course := models.Course{
		Code:     input.Code,
		Title:    input.Title,
		Credits:  input.Credits,
		Semester: input.Semester,
		Tahun:    input.Tahun,
		IsCommon: true,
	}

	if err := tx.Create(&course).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to create common course",
			"error":   err.Error(),
		})
		return
	}

	// Assign to prodis if provided
	if len(input.ProdiIDs) > 0 {
		for _, prodiID := range input.ProdiIDs {
			assign := models.CourseProdiAssign{
				CourseID: course.ID,
				ProdiID:  prodiID,
			}
			if err := tx.Create(&assign).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{
					"success": false,
					"message": "Failed to assign course to prodi",
					"error":   err.Error(),
				})
				return
			}
		}
	}

	tx.Commit()

	// Reload with assignments
	cc.db.Preload("AssignedProdis.Prodi").First(&course, course.ID)

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Common course created successfully",
		"data":    course,
	})
}

// UpdateCommonCourse - Update a common course
func (cc *CommonCourseController) UpdateCommonCourse(c *gin.Context) {
	id := c.Param("id")
	courseID, err := uuid.Parse(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid course ID",
		})
		return
	}

	var input struct {
		Code     string `json:"code"`
		Title    string `json:"title"`
		Credits  *int   `json:"credits"`
		Semester *int   `json:"semester"`
		Tahun    string `json:"tahun"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid input",
			"error":   err.Error(),
		})
		return
	}

	var course models.Course
	if err := cc.db.First(&course, courseID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"message": "Course not found",
		})
		return
	}

	updates := map[string]interface{}{}
	if input.Code != "" {
		updates["code"] = input.Code
	}
	if input.Title != "" {
		updates["title"] = input.Title
	}
	if input.Credits != nil {
		updates["credits"] = input.Credits
	}
	if input.Semester != nil {
		updates["semester"] = input.Semester
	}
	if input.Tahun != "" {
		updates["tahun"] = input.Tahun
	}

	if err := cc.db.Model(&course).Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to update course",
			"error":   err.Error(),
		})
		return
	}

	cc.db.Preload("AssignedProdis.Prodi").First(&course, courseID)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Common course updated successfully",
		"data":    course,
	})
}

// DeleteCommonCourse - Delete a common course
func (cc *CommonCourseController) DeleteCommonCourse(c *gin.Context) {
	id := c.Param("id")
	courseID, err := uuid.Parse(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid course ID",
		})
		return
	}

	var course models.Course
	if err := cc.db.First(&course, courseID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"message": "Course not found",
		})
		return
	}

	// Delete assignments first
	cc.db.Where("course_id = ?", courseID).Delete(&models.CourseProdiAssign{})

	// Delete course
	if err := cc.db.Delete(&course).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to delete course",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Common course deleted successfully",
	})
}

// AssignToProdi - Assign a common course to prodis
func (cc *CommonCourseController) AssignToProdi(c *gin.Context) {
	id := c.Param("id")
	courseID, err := uuid.Parse(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid course ID",
		})
		return
	}

	var input struct {
		ProdiIDs []uuid.UUID `json:"prodi_ids" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid input",
			"error":   err.Error(),
		})
		return
	}

	// Verify course exists and is common
	var course models.Course
	if err := cc.db.First(&course, courseID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"message": "Course not found",
		})
		return
	}

	if !course.IsCommon {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Course is not a common course",
		})
		return
	}

	// Start transaction
	tx := cc.db.Begin()

	// Delete existing assignments
	if err := tx.Unscoped().Where("course_id = ?", courseID).Delete(&models.CourseProdiAssign{}).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to update assignments",
			"error":   err.Error(),
		})
		return
	}

	// Create new assignments
	for _, prodiID := range input.ProdiIDs {
		assign := models.CourseProdiAssign{
			CourseID: courseID,
			ProdiID:  prodiID,
		}
		if err := tx.Create(&assign).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"message": "Failed to assign course to prodi",
				"error":   err.Error(),
			})
			return
		}
	}

	tx.Commit()

	// Reload with assignments
	cc.db.Preload("AssignedProdis.Prodi").First(&course, courseID)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Course assigned to prodis successfully",
		"data":    course,
	})
}

// GetCoursesByProdi - Get courses for a specific prodi (including common courses assigned to it)
func (cc *CommonCourseController) GetCoursesByProdi(c *gin.Context) {
	prodiID := c.Param("prodi_id")
	parsedProdiID, err := uuid.Parse(prodiID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid prodi ID",
		})
		return
	}

	// Get prodi's program
	var prodi models.Prodi
	if err := cc.db.First(&prodi, parsedProdiID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"message": "Prodi not found",
		})
		return
	}

	var courses []models.Course

	// Get program-specific courses (non-common)
	if prodi.ProgramID != nil {
		cc.db.Where("program_id = ? AND is_common = ?", prodi.ProgramID, false).
			Preload("Program").
			Find(&courses)
	}

	// Get common courses assigned to this prodi
	var commonCourseIDs []uuid.UUID
	cc.db.Model(&models.CourseProdiAssign{}).
		Where("prodi_id = ?", parsedProdiID).
		Pluck("course_id", &commonCourseIDs)

	if len(commonCourseIDs) > 0 {
		var commonCourses []models.Course
		cc.db.Where("id IN ? AND is_common = ?", commonCourseIDs, true).
			Preload("AssignedProdis.Prodi").
			Find(&commonCourses)
		courses = append(courses, commonCourses...)
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    courses,
	})
}
