package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type CleanupController struct {
	db *gorm.DB
}

func NewCleanupController(db *gorm.DB) *CleanupController {
	return &CleanupController{db: db}
}

// CleanupAllDataExceptAdmin - Hapus semua data kecuali admin
func (c *CleanupController) CleanupAllDataExceptAdmin(ctx *gin.Context) {
	// Begin transaction
	tx := c.db.Begin()

	queries := []string{
		"DELETE FROM cpl_indikator",
		"DELETE FROM cpl",
		"DELETE FROM dosen_rps_access",
		"DELETE FROM generated_rps",
		"DELETE FROM template_versions",
		"DELETE FROM templates",
		"DELETE FROM courses",
		"DELETE FROM programs",
		"DELETE FROM dosens",
		"DELETE FROM prodis",
		"DELETE FROM users WHERE role != 'admin'",
	}

	for _, query := range queries {
		if err := tx.Exec(query).Error; err != nil {
			tx.Rollback()
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"error":   "Failed to cleanup database",
				"details": err.Error(),
			})
			return
		}
	}

	// Commit transaction
	if err := tx.Commit().Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to commit cleanup",
		})
		return
	}

	// Get remaining counts
	var counts []struct {
		TableName string
		Count     int64
	}

	tables := []string{"users", "prodis", "programs", "dosens", "courses", "templates", "template_versions", "generated_rps", "dosen_rps_access", "cpl", "cpl_indikator"}

	for _, table := range tables {
		var count int64
		c.db.Table(table).Count(&count)
		counts = append(counts, struct {
			TableName string
			Count     int64
		}{
			TableName: table,
			Count:     count,
		})
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Database cleaned successfully (except admin users)",
		"counts":  counts,
	})
}
