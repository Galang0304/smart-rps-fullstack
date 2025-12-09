package controllers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/lukasjarosch/go-docx"
	"github.com/syrlramadhan/dokumentasi-rps-api/models"
	"gorm.io/gorm"
)

type GeneratedRPSController struct {
	db *gorm.DB
}

func NewGeneratedRPSController(db *gorm.DB) *GeneratedRPSController {
	return &GeneratedRPSController{db: db}
}

// GetAll - Get all generated RPS
func (gc *GeneratedRPSController) GetAll(c *gin.Context) {
	var generatedRPS []models.GeneratedRPS
	var total int64

	// Get query parameters
	dosenID := c.Query("dosen_id")

	query := gc.db.Model(&models.GeneratedRPS{})

	// Filter by dosen - only show RPS for courses assigned to this dosen
	if dosenID != "" {
		dosenUUID, err := uuid.Parse(dosenID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error":   "Invalid dosen_id",
				"message": "Format ID dosen tidak valid",
			})
			return
		}

		// Get dosen's courses
		var dosen models.Dosen
		if err := gc.db.Preload("Courses").First(&dosen, "id = ?", dosenUUID).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{
				"error":   "Not found",
				"message": "Dosen tidak ditemukan",
			})
			return
		}

		// Extract course IDs
		courseIDs := make([]uuid.UUID, len(dosen.Courses))
		for i, course := range dosen.Courses {
			courseIDs[i] = course.ID
		}

		// Filter RPS by course IDs
		if len(courseIDs) > 0 {
			query = query.Where("course_id IN ?", courseIDs)
		} else {
			// No courses assigned, return empty result
			c.JSON(http.StatusOK, gin.H{
				"success": true,
				"data": gin.H{
					"data": []models.GeneratedRPS{},
					"pagination": gin.H{
						"total_items":  0,
						"total_pages":  0,
						"current_page": 1,
						"per_page":     0,
					},
				},
			})
			return
		}
	}

	// Count total
	query.Count(&total)

	if err := query.Preload("Course").Preload("TemplateVersion").Preload("Generator").Find(&generatedRPS).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Gagal mengambil data RPS",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"data": generatedRPS,
			"pagination": gin.H{
				"total_items":  total,
				"total_pages":  1,
				"current_page": 1,
				"per_page":     total,
			},
		},
	})
}

// GetById - Get RPS by ID
func (gc *GeneratedRPSController) GetById(c *gin.Context) {
	id := c.Param("id")
	rpsUUID, err := uuid.Parse(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	var rps models.GeneratedRPS
	if err := gc.db.Preload("Course").Preload("Course.Program").Preload("TemplateVersion").Preload("Generator").First(&rps, "id = ?", rpsUUID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "RPS not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    rps,
	})
}

// Create - Create new RPS (initial record)
func (gc *GeneratedRPSController) Create(c *gin.Context) {
	var req struct {
		TemplateVersionID *string `json:"template_version_id"`
		CourseID          string  `json:"course_id" binding:"required"`
		GeneratedBy       *string `json:"generated_by"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Parse CourseID
	courseUUID, err := uuid.Parse(req.CourseID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid course_id format"})
		return
	}

	// Check if course exists
	var course models.Course
	if err := gc.db.First(&course, "id = ?", courseUUID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Course not found"})
		return
	}

	// Create GeneratedRPS
	rps := models.GeneratedRPS{
		CourseID: &courseUUID,
		Status:   "draft",
	}

	if req.TemplateVersionID != nil && *req.TemplateVersionID != "" {
		templateUUID, err := uuid.Parse(*req.TemplateVersionID)
		if err == nil {
			rps.TemplateVersionID = &templateUUID
		}
	}

	if req.GeneratedBy != nil && *req.GeneratedBy != "" {
		generatorUUID, err := uuid.Parse(*req.GeneratedBy)
		if err == nil {
			rps.GeneratedBy = &generatorUUID
		}
	}

	if err := gc.db.Create(&rps).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create RPS"})
		return
	}

	// Load relationships
	gc.db.Preload("Course").Preload("TemplateVersion").Preload("Generator").First(&rps, "id = ?", rps.ID)

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"data":    rps,
	})
}

// CreateDraft - Update RPS with result data (save draft)
func (gc *GeneratedRPSController) CreateDraft(c *gin.Context) {
	var req struct {
		JobID  string                 `json:"job_id" binding:"required"`
		Status string                 `json:"status"`
		Result map[string]interface{} `json:"result" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	jobUUID, err := uuid.Parse(req.JobID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid job_id format"})
		return
	}

	var rps models.GeneratedRPS
	if err := gc.db.First(&rps, "id = ?", jobUUID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "RPS not found"})
		return
	}

	// Update result and status
	updates := map[string]interface{}{
		"result": req.Result,
	}
	if req.Status != "" {
		updates["status"] = req.Status
	}

	if err := gc.db.Model(&rps).Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update RPS"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    rps,
	})
}

// Update - Update existing RPS
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

	var req struct {
		Status string                 `json:"status"`
		Result map[string]interface{} `json:"result"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updates := map[string]interface{}{}
	if req.Status != "" {
		updates["status"] = req.Status
	}
	if req.Result != nil {
		updates["result"] = req.Result
	}

	if err := gc.db.Model(&rps).Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update RPS"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    rps,
	})
}

// UpdateStatus - Update RPS status only
func (gc *GeneratedRPSController) UpdateStatus(c *gin.Context) {
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

	var req struct {
		Status string `json:"status" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := gc.db.Model(&rps).Update("status", req.Status).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update status"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Status updated successfully",
	})
}

// Delete - Soft delete RPS
func (gc *GeneratedRPSController) Delete(c *gin.Context) {
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

	if err := gc.db.Delete(&rps).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete RPS"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "RPS deleted successfully",
	})
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
	replaceMap["{RUMPUN_MK}"] = ""
	replaceMap["{NAMA_PENYUSUN}"] = ""
	replaceMap["{KOORDINATOR_MK}"] = ""
	replaceMap["{DESKRIPSI_MK}"] = ""
	replaceMap["{MK_PRASYARAT}"] = ""
	replaceMap["{REFERENSI_LIST}"] = ""

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

	// Get Prodi info - fallback to Program.Prodi if dosen doesn't have fakultas
	if rps.Course.Program != nil {
		replaceMap["{PROGRAM_STUDI}"] = rps.Course.Program.Name
		if rps.Course.Program.Prodi != nil {
			replaceMap["{KETUA_PRODI}"] = rps.Course.Program.Prodi.NamaKaprodi
			// Use fakultas from dosen's prodi, fallback to program's prodi
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

	// CPL_LIST (Capaian Pembelajaran Lulusan)
	replaceMap["{CPL_LIST}"] = ""

	// CPMK_LIST (Capaian Pembelajaran Mata Kuliah)
	cpmkListText := ""
	if cpmkData, ok := result["cpmk"].([]interface{}); ok {
		for i, item := range cpmkData {
			if cpmk, ok := item.(map[string]interface{}); ok {
				desc := getString(cpmk, "description")
				cpmkListText += fmt.Sprintf("%d. %s\n", i+1, desc)
			}
		}
	}
	replaceMap["{CPMK_LIST}"] = cpmkListText
	// Backward compatibility
	replaceMap["{CPMK}"] = cpmkListText

	// SUB_CPMK_LIST (Sub Capaian Pembelajaran)
	subCPMKListText := ""
	if subCPMKData, ok := result["subCPMK"].([]interface{}); ok {
		for i, item := range subCPMKData {
			if subCPMK, ok := item.(map[string]interface{}); ok {
				code := getString(subCPMK, "code")
				desc := getString(subCPMK, "description")
				subCPMKListText += fmt.Sprintf("%d. %s: %s\n", i+1, code, desc)
			}
		}
	}
	replaceMap["{SUB_CPMK_LIST}"] = subCPMKListText
	// Backward compatibility
	replaceMap["{SUB_CPMK}"] = subCPMKListText

	// TOPIK_LIST (Bahan Kajian/Topik)
	topikListText := ""
	if topikData, ok := result["topik"].([]interface{}); ok {
		for i, item := range topikData {
			if topik, ok := item.(map[string]interface{}); ok {
				topic := getString(topik, "topic")
				if topic != "" {
					topikListText += fmt.Sprintf("%d. %s\n", i+1, topic)
				}
			}
		}
	}
	replaceMap["{TOPIK_LIST}"] = topikListText

	// RENCANA PEMBELAJARAN PER MINGGU (untuk tabel)
	mingguText := ""
	subCPMKMingguanText := ""
	indikatorMingguanText := ""
	topikMingguanText := ""
	metodePembelajaranText := ""
	estimasiWaktuText := ""
	kriteriaPenilaianText := ""
	bobotNilaiText := ""

	if topikData, ok := result["topik"].([]interface{}); ok {
		for i, item := range topikData {
			if topik, ok := item.(map[string]interface{}); ok {
				topic := getString(topik, "topic")
				desc := getString(topik, "description")
				if topic != "" {
					mingguText += fmt.Sprintf("%d\n", i+1)
					topikMingguanText += fmt.Sprintf("%s\n%s\n\n", topic, desc)
					subCPMKMingguanText += "-\n"
					indikatorMingguanText += "-\n"
					metodePembelajaranText += "-\n"
					estimasiWaktuText += "150\n"
					kriteriaPenilaianText += "-\n"
					bobotNilaiText += "-\n"
				}
			}
		}
	}

	replaceMap["{MINGGU_KE}"] = mingguText
	replaceMap["{SUB_CPMK_MINGGUAN}"] = subCPMKMingguanText
	replaceMap["{INDIKATOR_MINGGUAN}"] = indikatorMingguanText
	replaceMap["{TOPIK_MINGGUAN}"] = topikMingguanText
	replaceMap["{METODE_PEMBELAJARAN}"] = metodePembelajaranText
	replaceMap["{ESTIMASI_WAKTU}"] = estimasiWaktuText
	replaceMap["{KRITERIA_PENILAIAN}"] = kriteriaPenilaianText
	replaceMap["{BOBOT_NILAI}"] = bobotNilaiText

	// Backward compatibility
	replaceMap["{TOPIK_PEMBELAJARAN}"] = topikMingguanText

	// Tugas - Support untuk 3 tugas terpisah (format baru sesuai template)
	if tugasData, ok := result["tugas"].([]interface{}); ok {
		for i := 0; i < 3; i++ {
			if i < len(tugasData) {
				if tugas, ok := tugasData[i].(map[string]interface{}); ok {
					// Format baru sesuai template yang diberikan
					replaceMap[fmt.Sprintf("{SUB_CPMK_TUGAS_%d}", i+1)] = getString(tugas, "sub_cpmk")
					replaceMap[fmt.Sprintf("{INDIKATOR_TUGAS_%d}", i+1)] = getString(tugas, "indikator")
					replaceMap[fmt.Sprintf("{JUDUL_TUGAS_%d}", i+1)] = getString(tugas, "judul_tugas")
					replaceMap[fmt.Sprintf("{BATAS_TUGAS_%d}", i+1)] = getString(tugas, "batas_waktu")
					replaceMap[fmt.Sprintf("{PETUNJUK_TUGAS_%d}", i+1)] = getString(tugas, "petunjuk_pengerjaan")
					replaceMap[fmt.Sprintf("{LUARAN_TUGAS_%d}", i+1)] = getString(tugas, "luaran_tugas")
					replaceMap[fmt.Sprintf("{KRITERIA_TUGAS_%d}", i+1)] = getString(tugas, "kriteria")
					replaceMap[fmt.Sprintf("{TEKNIK_PENILAIAN_TUGAS_%d}", i+1)] = getString(tugas, "teknik_penilaian")
					replaceMap[fmt.Sprintf("{BOBOT_TUGAS_%d}", i+1)] = fmt.Sprintf("%v", tugas["bobot"])

					// Backward compatibility - format lama
					replaceMap[fmt.Sprintf("{TUGAS_%d_NAMA_MK}", i+1)] = rps.Course.Title
					replaceMap[fmt.Sprintf("{TUGAS_%d_KODE_MK}", i+1)] = rps.Course.Code
					replaceMap[fmt.Sprintf("{TUGAS_%d_SEMESTER}", i+1)] = ""
					replaceMap[fmt.Sprintf("{TUGAS_%d_SKS}", i+1)] = fmt.Sprintf("%d", rps.Course.Credits)
					replaceMap[fmt.Sprintf("{TUGAS_%d_SUB_CPMK}", i+1)] = getString(tugas, "sub_cpmk")
					replaceMap[fmt.Sprintf("{TUGAS_%d_INDIKATOR}", i+1)] = getString(tugas, "indikator")
					replaceMap[fmt.Sprintf("{TUGAS_%d_JUDUL}", i+1)] = getString(tugas, "judul_tugas")
					replaceMap[fmt.Sprintf("{TUGAS_%d_BATAS_WAKTU}", i+1)] = getString(tugas, "batas_waktu")
					replaceMap[fmt.Sprintf("{TUGAS_%d_PETUNJUK}", i+1)] = getString(tugas, "petunjuk_pengerjaan")
					replaceMap[fmt.Sprintf("{TUGAS_%d_LUARAN}", i+1)] = getString(tugas, "luaran_tugas")
					replaceMap[fmt.Sprintf("{TUGAS_%d_KRITERIA}", i+1)] = getString(tugas, "kriteria")
					replaceMap[fmt.Sprintf("{TUGAS_%d_TEKNIK}", i+1)] = getString(tugas, "teknik_penilaian")
					replaceMap[fmt.Sprintf("{TUGAS_%d_BOBOT}", i+1)] = fmt.Sprintf("%v", tugas["bobot"])

					// Daftar Rujukan
					rujukanText := ""
					if rujukan, ok := tugas["daftar_rujukan"].([]interface{}); ok {
						for j, ref := range rujukan {
							if refStr, ok := ref.(string); ok {
								rujukanText += fmt.Sprintf("%d. %s\n", j+1, refStr)
							}
						}
					}
					replaceMap[fmt.Sprintf("{TUGAS_%d_RUJUKAN}", i+1)] = rujukanText
				}
			} else {
				// Jika tugas tidak ada, kosongkan placeholder (format baru)
				replaceMap[fmt.Sprintf("{SUB_CPMK_TUGAS_%d}", i+1)] = ""
				replaceMap[fmt.Sprintf("{INDIKATOR_TUGAS_%d}", i+1)] = ""
				replaceMap[fmt.Sprintf("{JUDUL_TUGAS_%d}", i+1)] = ""
				replaceMap[fmt.Sprintf("{BATAS_TUGAS_%d}", i+1)] = ""
				replaceMap[fmt.Sprintf("{PETUNJUK_TUGAS_%d}", i+1)] = ""
				replaceMap[fmt.Sprintf("{LUARAN_TUGAS_%d}", i+1)] = ""
				replaceMap[fmt.Sprintf("{KRITERIA_TUGAS_%d}", i+1)] = ""
				replaceMap[fmt.Sprintf("{TEKNIK_PENILAIAN_TUGAS_%d}", i+1)] = ""
				replaceMap[fmt.Sprintf("{BOBOT_TUGAS_%d}", i+1)] = ""

				// Backward compatibility - format lama
				replaceMap[fmt.Sprintf("{TUGAS_%d_NAMA_MK}", i+1)] = ""
				replaceMap[fmt.Sprintf("{TUGAS_%d_KODE_MK}", i+1)] = ""
				replaceMap[fmt.Sprintf("{TUGAS_%d_SEMESTER}", i+1)] = ""
				replaceMap[fmt.Sprintf("{TUGAS_%d_SKS}", i+1)] = ""
				replaceMap[fmt.Sprintf("{TUGAS_%d_SUB_CPMK}", i+1)] = ""
				replaceMap[fmt.Sprintf("{TUGAS_%d_INDIKATOR}", i+1)] = ""
				replaceMap[fmt.Sprintf("{TUGAS_%d_JUDUL}", i+1)] = ""
				replaceMap[fmt.Sprintf("{TUGAS_%d_BATAS_WAKTU}", i+1)] = ""
				replaceMap[fmt.Sprintf("{TUGAS_%d_PETUNJUK}", i+1)] = ""
				replaceMap[fmt.Sprintf("{TUGAS_%d_LUARAN}", i+1)] = ""
				replaceMap[fmt.Sprintf("{TUGAS_%d_KRITERIA}", i+1)] = ""
				replaceMap[fmt.Sprintf("{TUGAS_%d_TEKNIK}", i+1)] = ""
				replaceMap[fmt.Sprintf("{TUGAS_%d_BOBOT}", i+1)] = ""
				replaceMap[fmt.Sprintf("{TUGAS_%d_RUJUKAN}", i+1)] = ""
			}
		}
	}

	// Replace placeholders
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
func getString(m map[string]interface{}, key string) string {
	if val, ok := m[key]; ok {
		if str, ok := val.(string); ok {
			return str
		}
	}
	return ""
}
