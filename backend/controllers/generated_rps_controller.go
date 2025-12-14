package controllers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"smart-rps-backend/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/lukasjarosch/go-docx"
	"gorm.io/gorm"
)

type GeneratedRPSController struct {
	db *gorm.DB
}

func NewGeneratedRPSController(db *gorm.DB) *GeneratedRPSController {
	return &GeneratedRPSController{db: db}
}

// Export - Export RPS to Word document using template
func (gc *GeneratedRPSController) Export(c *gin.Context) {
	id := c.Param("id")
	rpsUUID, err := uuid.Parse(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	var rps models.GeneratedRPS
	// Use Unscoped() to include soft-deleted courses so export still works
	// Also preload Program.Prodi for kaprodi name
	if err := gc.db.Preload("Course", func(db *gorm.DB) *gorm.DB {
		return db.Unscoped()
	}).Preload("Course.Program", func(db *gorm.DB) *gorm.DB {
		return db.Unscoped()
	}).Preload("Course.Program.Prodi", func(db *gorm.DB) *gorm.DB {
		return db.Unscoped()
	}).First(&rps, "id = ?", rpsUUID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "RPS not found"})
		return
	}

	// Safety check: ensure Course is loaded
	if rps.Course == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Course not found for this RPS"})
		return
	}

	// Get Dosen info via many2many dosen_courses table
	var dosens []models.Dosen
	gc.db.Preload("Prodi").
		Joins("JOIN dosen_courses ON dosen_courses.dosen_id = dosens.id").
		Where("dosen_courses.course_id = ?", rps.CourseID).
		Find(&dosens)

	// Parse result JSON
	var result map[string]interface{}
	if err := json.Unmarshal(rps.Result, &result); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse RPS data"})
		return
	}

	// Load template
	templatePath := "templates/template_rps.docx"
	if _, err := os.Stat(templatePath); os.IsNotExist(err) {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Template file not found. Please place template_rps.docx in templates folder"})
		return
	}

	// Read template
	replaceMap := docx.PlaceholderMap{}

	// Helper to safely get int from pointer
	getIntValue := func(ptr *int) string {
		if ptr != nil {
			return fmt.Sprintf("%d", *ptr)
		}
		return ""
	}

	// Basic Info
	replaceMap["{KODE_MK}"] = rps.Course.Code
	replaceMap["{NAMA_MK}"] = rps.Course.Title
	replaceMap["{SKS}"] = getIntValue(rps.Course.Credits)
	replaceMap["{SKS_TEORI}"] = getIntValue(rps.Course.Credits)
	replaceMap["{SKS_PRAKTIK}"] = "0"
	replaceMap["{SEMESTER}"] = getIntValue(rps.Course.Semester)
	replaceMap["{TGL_PENYUSUNAN}"] = time.Now().Format("02/01/2006")

	// Get Dosen name and Fakultas from dosen data
	namaDosen := ""
	fakultasDosen := ""
	if len(dosens) > 0 {
		namaDosen = dosens[0].NamaLengkap
		if dosens[0].Prodi != nil {
			fakultasDosen = dosens[0].Prodi.Fakultas
		}
	}
	replaceMap["{NAMA_DOSEN}"] = namaDosen
	replaceMap["{DOSEN}"] = namaDosen

	// Get Prodi info
	if rps.Course.Program != nil {
		replaceMap["{PROGRAM_STUDI}"] = rps.Course.Program.Name
		if rps.Course.Program.Prodi != nil {
			replaceMap["{KETUA_PRODI}"] = rps.Course.Program.Prodi.NamaKaprodi
			if fakultasDosen != "" {
				replaceMap["{FAKULTAS}"] = fakultasDosen
			} else {
				replaceMap["{FAKULTAS}"] = rps.Course.Program.Prodi.Fakultas
			}
		} else {
			replaceMap["{KETUA_PRODI}"] = ""
			replaceMap["{FAKULTAS}"] = fakultasDosen
		}
	} else {
		replaceMap["{PROGRAM_STUDI}"] = ""
		replaceMap["{KETUA_PRODI}"] = ""
		replaceMap["{FAKULTAS}"] = fakultasDosen
	}

	// Tugas - DINAMIS: Hanya sebanyak jumlah tugas yang ada
	if tugasData, ok := result["tugas"].([]interface{}); ok {
		// Hitung jumlah tugas aktual
		numTugas := len(tugasData)
		fmt.Printf("Jumlah tugas yang akan di-export: %d\n", numTugas)

		// Iterasi hanya sebanyak jumlah tugas yang ada
		for i := 0; i < numTugas; i++ {
			if tugas, ok := tugasData[i].(map[string]interface{}); ok {
				replaceMap[fmt.Sprintf("{SUB_CPMK_TUGAS_%d}", i+1)] = getString(tugas, "sub_cpmk")
				replaceMap[fmt.Sprintf("{INDIKATOR_TUGAS_%d}", i+1)] = getString(tugas, "indikator")
				replaceMap[fmt.Sprintf("{JUDUL_TUGAS_%d}", i+1)] = getString(tugas, "judul_tugas")
				replaceMap[fmt.Sprintf("{BATAS_TUGAS_%d}", i+1)] = getString(tugas, "batas_waktu")
				replaceMap[fmt.Sprintf("{PETUNJUK_TUGAS_%d}", i+1)] = getString(tugas, "petunjuk_pengerjaan")
				replaceMap[fmt.Sprintf("{LUARAN_TUGAS_%d}", i+1)] = getString(tugas, "luaran_tugas")
				replaceMap[fmt.Sprintf("{KRITERIA_TUGAS_%d}", i+1)] = getString(tugas, "kriteria")
				replaceMap[fmt.Sprintf("{TEKNIK_PENILAIAN_TUGAS_%d}", i+1)] = getString(tugas, "teknik_penilaian")
				replaceMap[fmt.Sprintf("{BOBOT_TUGAS_%d}", i+1)] = fmt.Sprintf("%v", tugas["bobot"])

				// Daftar Rujukan
				rujukanText := ""
				if rujukan, ok := tugas["daftar_rujukan"].([]interface{}); ok && len(rujukan) > 0 {
					for j, ref := range rujukan {
						if refStr, ok := ref.(string); ok && refStr != "" {
							rujukanText += fmt.Sprintf("%d. %s\n", j+1, strings.TrimSpace(refStr))
						}
					}
				}
				if rujukanText == "" {
					rujukanText = "[Belum ada daftar rujukan]"
				}
				replaceMap[fmt.Sprintf("{DAFTAR_RUJUKAN_%d}", i+1)] = rujukanText
			}
		}

		// Clear semua placeholder untuk tugas yang tidak ada (dari N+1 sampai 20)
		for i := numTugas + 1; i <= 20; i++ {
			replaceMap[fmt.Sprintf("{SUB_CPMK_TUGAS_%d}", i)] = ""
			replaceMap[fmt.Sprintf("{INDIKATOR_TUGAS_%d}", i)] = ""
			replaceMap[fmt.Sprintf("{JUDUL_TUGAS_%d}", i)] = ""
			replaceMap[fmt.Sprintf("{BATAS_TUGAS_%d}", i)] = ""
			replaceMap[fmt.Sprintf("{PETUNJUK_TUGAS_%d}", i)] = ""
			replaceMap[fmt.Sprintf("{LUARAN_TUGAS_%d}", i)] = ""
			replaceMap[fmt.Sprintf("{KRITERIA_TUGAS_%d}", i)] = ""
			replaceMap[fmt.Sprintf("{TEKNIK_PENILAIAN_TUGAS_%d}", i)] = ""
			replaceMap[fmt.Sprintf("{BOBOT_TUGAS_%d}", i)] = ""
			replaceMap[fmt.Sprintf("{DAFTAR_RUJUKAN_%d}", i)] = ""
		}
	} else {
		// Tidak ada tugas sama sekali, clear semua placeholder
		for i := 1; i <= 20; i++ {
			replaceMap[fmt.Sprintf("{SUB_CPMK_TUGAS_%d}", i)] = ""
			replaceMap[fmt.Sprintf("{INDIKATOR_TUGAS_%d}", i)] = ""
			replaceMap[fmt.Sprintf("{JUDUL_TUGAS_%d}", i)] = ""
			replaceMap[fmt.Sprintf("{BATAS_TUGAS_%d}", i)] = ""
			replaceMap[fmt.Sprintf("{PETUNJUK_TUGAS_%d}", i)] = ""
			replaceMap[fmt.Sprintf("{LUARAN_TUGAS_%d}", i)] = ""
			replaceMap[fmt.Sprintf("{KRITERIA_TUGAS_%d}", i)] = ""
			replaceMap[fmt.Sprintf("{TEKNIK_PENILAIAN_TUGAS_%d}", i)] = ""
			replaceMap[fmt.Sprintf("{BOBOT_TUGAS_%d}", i)] = ""
			replaceMap[fmt.Sprintf("{DAFTAR_RUJUKAN_%d}", i)] = ""
		}
	}

	// Replace placeholders di template
	doc, err := docx.Open(templatePath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to open template: " + err.Error()})
		return
	}
	defer doc.Close()

	if err := doc.ReplaceAll(replaceMap); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to replace placeholders: " + err.Error()})
		return
	}

	// Write to buffer
	var buf bytes.Buffer
	if err := doc.Write(&buf); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to write document: " + err.Error()})
		return
	}

	// Generate filename
	filename := fmt.Sprintf("RPS_%s_%s.docx", rps.Course.Code, rps.Course.Title)
	filename = strings.ReplaceAll(filename, " ", "_")

	// Set headers and send file
	c.Header("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
	c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=\"%s\"", filename))
	c.Data(http.StatusOK, "application/vnd.openxmlformats-officedocument.wordprocessingml.document", buf.Bytes())
}

// Helper function to safely get string from map
func getString(data map[string]interface{}, key string) string {
	if value, ok := data[key]; ok {
		if str, ok := value.(string); ok {
			return str
		}
		// Convert other types to string
		return fmt.Sprintf("%v", value)
	}
	return ""
}

// Create - Create new RPS
func (gc *GeneratedRPSController) Create(c *gin.Context) {
	var input struct {
		CourseID *uuid.UUID `json:"course_id"`
		Result   []byte     `json:"result" binding:"required"`
		Status   string     `json:"status"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	rps := models.GeneratedRPS{
		CourseID: input.CourseID,
		Result:   input.Result,
		Status:   input.Status,
	}

	if err := gc.db.Create(&rps).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create RPS"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": rps})
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
		Result []byte `json:"result"`
		Status string `json:"status"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if input.Result != nil {
		rps.Result = input.Result
	}
	if input.Status != "" {
		rps.Status = input.Status
	}

	if err := gc.db.Save(&rps).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update RPS"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": rps})
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
