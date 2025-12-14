package controllers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
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

// Helper to get keys from map
func getKeys(m map[string]interface{}) []string {
	keys := make([]string, 0, len(m))
	for k := range m {
		keys = append(keys, k)
	}
	return keys
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
		log.Printf("ERROR Export - Failed to parse RPS data: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse RPS data"})
		return
	}

	// Log untuk debugging
	log.Printf("Export RPS ID: %s, CourseID: %s", rpsUUID, rps.CourseID)
	log.Printf("Data keys in result: %v", getKeys(result))

	// Check if topik and tugas exist
	if topik, ok := result["topik"].([]interface{}); ok {
		log.Printf("Found %d topik items", len(topik))
	} else {
		log.Printf("WARNING: No topik found in result data")
	}
	if tugas, ok := result["tugas"].([]interface{}); ok {
		log.Printf("Found %d tugas items", len(tugas))
	} else {
		log.Printf("WARNING: No tugas found in result data")
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

	// CPL, CPMK, Sub-CPMK Lists
	cplList := ""
	if cpmkData, ok := result["cpmk"].([]interface{}); ok && len(cpmkData) > 0 {
		for i, cpmk := range cpmkData {
			if cpmkMap, ok := cpmk.(map[string]interface{}); ok {
				cplList += fmt.Sprintf("%d. %s\n", i+1, getString(cpmkMap, "description"))
			}
		}
	}
	if cplList == "" {
		cplList = "[Belum ada CPL/CPMK]"
	}
	replaceMap["{CPL_LIST}"] = cplList
	replaceMap["{CPMK_LIST}"] = cplList

	subCpmkList := ""
	if subCpmkData, ok := result["subCPMK"].([]interface{}); ok && len(subCpmkData) > 0 {
		for i, sub := range subCpmkData {
			if subMap, ok := sub.(map[string]interface{}); ok {
				subCpmkList += fmt.Sprintf("%d. %s\n", i+1, getString(subMap, "description"))
			}
		}
	}
	if subCpmkList == "" {
		subCpmkList = "[Belum ada Sub-CPMK]"
	}
	replaceMap["{SUB_CPMK_LIST}"] = subCpmkList

	// Topik List
	topikList := ""
	if topikData, ok := result["topik"].([]interface{}); ok && len(topikData) > 0 {
		for i, topik := range topikData {
			if topikMap, ok := topik.(map[string]interface{}); ok {
				topikList += fmt.Sprintf("%d. %s: %s\n", i+1, getString(topikMap, "topic"), getString(topikMap, "description"))
			}
		}
	}
	if topikList == "" {
		topikList = "[Belum ada topik]"
	}
	replaceMap["{TOPIK_LIST}"] = topikList

	// Referensi dari tugas
	referensiSet := make(map[string]bool)
	if tugasData, ok := result["tugas"].([]interface{}); ok {
		for _, tugas := range tugasData {
			if tugasMap, ok := tugas.(map[string]interface{}); ok {
				if rujukan, ok := tugasMap["daftar_rujukan"].([]interface{}); ok {
					for _, ref := range rujukan {
						if refStr, ok := ref.(string); ok && refStr != "" {
							referensiSet[refStr] = true
						}
					}
				}
			}
		}
	}
	referensiList := ""
	i := 1
	for ref := range referensiSet {
		referensiList += fmt.Sprintf("%d. %s\n", i, ref)
		i++
	}
	if referensiList == "" {
		referensiList = "[Belum ada referensi]"
	}
	replaceMap["{REFERENSI_LIST}"] = referensiList

	// Default values untuk field yang tidak ada di JSON
	replaceMap["{RUMPUN_MK}"] = getString(result, "rumpun_mk")
	if replaceMap["{RUMPUN_MK}"] == "" {
		replaceMap["{RUMPUN_MK}"] = "-"
	}
	replaceMap["{DESKRIPSI_MK}"] = getString(result, "deskripsi")
	if replaceMap["{DESKRIPSI_MK}"] == "" {
		replaceMap["{DESKRIPSI_MK}"] = "[Deskripsi mata kuliah belum diisi]"
	}
	replaceMap["{MK_PRASYARAT}"] = getString(result, "mk_prasyarat")
	if replaceMap["{MK_PRASYARAT}"] == "" {
		replaceMap["{MK_PRASYARAT}"] = "-"
	}

	// Tugas - DINAMIS: Hanya sebanyak jumlah tugas yang ada
	if tugasData, ok := result["tugas"].([]interface{}); ok {
		// Hitung jumlah tugas aktual
		numTugas := len(tugasData)
		log.Printf("Jumlah tugas yang akan di-export: %d", numTugas)

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

	// Rencana Pembelajaran - menggunakan data topik
	if topikData, ok := result["topik"].([]interface{}); ok {
		numMinggu := len(topikData)
		log.Printf("Jumlah minggu pembelajaran yang akan di-export: %d", numMinggu)

		// Get sub-CPMK list untuk distribusi ke minggu
		var subCpmkList []string
		if subCpmkData, ok := result["subCPMK"].([]interface{}); ok {
			for _, sub := range subCpmkData {
				if subMap, ok := sub.(map[string]interface{}); ok {
					desc := getString(subMap, "description")
					if desc != "" {
						subCpmkList = append(subCpmkList, desc)
					}
				}
			}
		}

		// Iterasi hanya sebanyak jumlah minggu yang ada
		for i := 0; i < numMinggu; i++ {
			if minggu, ok := topikData[i].(map[string]interface{}); ok {
				weekNum := i + 1

				// Minggu ke-
				mingguKe := getString(minggu, "week")
				if mingguKe == "" {
					mingguKe = fmt.Sprintf("%d", weekNum)
				}
				replaceMap[fmt.Sprintf("{MINGGU_%d}", weekNum)] = mingguKe

				// Sub-CPMK - distribusi dari list sub-CPMK yang ada
				subCpmkText := getString(minggu, "sub_cpmk")
				if subCpmkText == "" {
					// Coba ambil dari metadata
					if meta, ok := minggu["metadata"].(map[string]interface{}); ok {
						if subcpmk, ok := meta["subcpmk"].([]interface{}); ok && len(subcpmk) > 0 {
							for j, sc := range subcpmk {
								if scStr, ok := sc.(string); ok {
									if j > 0 {
										subCpmkText += ", "
									}
									subCpmkText += scStr
								}
							}
						}
					}
				}
				// Jika masih kosong, ambil dari list sub-CPMK (distribusi round-robin)
				if subCpmkText == "" && len(subCpmkList) > 0 {
					idx := i % len(subCpmkList)
					subCpmkText = fmt.Sprintf("Sub-CPMK %d", idx+1)
				}
				if subCpmkText == "" {
					subCpmkText = "Mengacu pada Sub-CPMK mata kuliah"
				}
				replaceMap[fmt.Sprintf("{SUB_CPMK_%d}", weekNum)] = subCpmkText
				log.Printf("Week %d: SUB_CPMK = '%s'", weekNum, subCpmkText)

				// Indikator - buat berdasarkan topik
				indikator := getString(minggu, "indikator")
				if indikator == "" {
					topik := getString(minggu, "topic")
					if topik != "" {
						indikator = fmt.Sprintf("Mahasiswa mampu memahami dan menjelaskan materi %s", topik)
					} else {
						indikator = "Mahasiswa mampu memahami materi pembelajaran"
					}
				}
				replaceMap[fmt.Sprintf("{INDIKATOR_%d}", weekNum)] = indikator
				log.Printf("Week %d: INDIKATOR = '%s'", weekNum, indikator)

				// Topik dan Subtopik
				topik := getString(minggu, "topic")
				deskripsi := getString(minggu, "description")
				topikFull := topik
				if deskripsi != "" && deskripsi != topik {
					topikFull += ": " + deskripsi
				}
				replaceMap[fmt.Sprintf("{TOPIK_%d}", weekNum)] = topikFull

				// Aktivitas pembelajaran - ambil dari metadata
				aktivitas := getString(minggu, "aktivitas")
				if aktivitas == "" {
					if meta, ok := minggu["metadata"].(map[string]interface{}); ok {
						aktivitas = getString(meta, "aktivitas_pembelajaran")
						if aktivitas == "" {
							aktivitas = getString(meta, "metode_pembelajaran")
						}
					}
				}
				if aktivitas == "" {
					aktivitas = "Kuliah, diskusi, dan latihan"
				}
				replaceMap[fmt.Sprintf("{AKTIVITAS_%d}", weekNum)] = aktivitas
				replaceMap[fmt.Sprintf("{METODE_%d}", weekNum)] = aktivitas

				// Waktu
				waktu := getString(minggu, "waktu")
				if waktu == "" {
					waktu = "3 x 50 menit"
				}
				replaceMap[fmt.Sprintf("{WAKTU_%d}", weekNum)] = waktu

				// Penilaian/Kriteria
				penilaian := getString(minggu, "penilaian")
				if penilaian == "" {
					if meta, ok := minggu["metadata"].(map[string]interface{}); ok {
						penilaian = getString(meta, "penilaian")
						if penilaian == "" {
							penilaian = getString(meta, "kriteria_penilaian")
						}
					}
				}
				if penilaian == "" {
					// Buat kriteria penilaian default berdasarkan minggu
					if weekNum <= 4 {
						penilaian = "Partisipasi dan diskusi kelas"
					} else if weekNum <= 8 {
						penilaian = "Quiz dan tugas individu"
					} else if weekNum <= 12 {
						penilaian = "Presentasi kelompok"
					} else {
						penilaian = "Ujian dan proyek akhir"
					}
				}
				replaceMap[fmt.Sprintf("{PENILAIAN_%d}", weekNum)] = penilaian
				replaceMap[fmt.Sprintf("{KRITERIA_%d}", weekNum)] = penilaian
				log.Printf("Week %d: KRITERIA = '%s'", weekNum, penilaian)

				// Pengalaman belajar
				pengalamanBelajar := ""
				if pb, ok := minggu["pengalaman_belajar"].([]interface{}); ok {
					for j, exp := range pb {
						if expStr, ok := exp.(string); ok {
							if j > 0 {
								pengalamanBelajar += ", "
							}
							pengalamanBelajar += expStr
						}
					}
				}
				if pengalamanBelajar == "" {
					// Coba dari metadata
					if meta, ok := minggu["metadata"].(map[string]interface{}); ok {
						if pb, ok := meta["pengalaman_belajar"].([]interface{}); ok {
							for j, exp := range pb {
								if expStr, ok := exp.(string); ok {
									if j > 0 {
										pengalamanBelajar += ", "
									}
									pengalamanBelajar += expStr
								}
							}
						}
					}
				}
				if pengalamanBelajar == "" {
					pengalamanBelajar = "Mahasiswa mengikuti kuliah dan diskusi"
				}
				replaceMap[fmt.Sprintf("{PENGALAMAN_%d}", weekNum)] = pengalamanBelajar

				// Bobot - default 0 jika tidak ada
				bobot := getString(minggu, "bobot")
				if bobot == "" {
					bobot = "0"
				}
				replaceMap[fmt.Sprintf("{BOBOT_%d}", weekNum)] = bobot
				log.Printf("Week %d: BOBOT = '%s'", weekNum, bobot)
			}
		}

		// Clear semua placeholder untuk minggu yang tidak ada (dari N+1 sampai 20)
		for i := numMinggu + 1; i <= 20; i++ {
			replaceMap[fmt.Sprintf("{MINGGU_%d}", i)] = ""
			replaceMap[fmt.Sprintf("{SUB_CPMK_%d}", i)] = ""
			replaceMap[fmt.Sprintf("{INDIKATOR_%d}", i)] = ""
			replaceMap[fmt.Sprintf("{TOPIK_%d}", i)] = ""
			replaceMap[fmt.Sprintf("{METODE_%d}", i)] = ""
			replaceMap[fmt.Sprintf("{AKTIVITAS_%d}", i)] = ""
			replaceMap[fmt.Sprintf("{WAKTU_%d}", i)] = ""
			replaceMap[fmt.Sprintf("{PENGALAMAN_%d}", i)] = ""
			replaceMap[fmt.Sprintf("{KRITERIA_%d}", i)] = ""
			replaceMap[fmt.Sprintf("{PENILAIAN_%d}", i)] = ""
			replaceMap[fmt.Sprintf("{BOBOT_%d}", i)] = ""
		}
	} else {
		// Tidak ada rencana pembelajaran sama sekali, clear semua placeholder
		for i := 1; i <= 20; i++ {
			replaceMap[fmt.Sprintf("{MINGGU_%d}", i)] = ""
			replaceMap[fmt.Sprintf("{SUB_CPMK_%d}", i)] = ""
			replaceMap[fmt.Sprintf("{INDIKATOR_%d}", i)] = ""
			replaceMap[fmt.Sprintf("{TOPIK_%d}", i)] = ""
			replaceMap[fmt.Sprintf("{METODE_%d}", i)] = ""
			replaceMap[fmt.Sprintf("{AKTIVITAS_%d}", i)] = ""
			replaceMap[fmt.Sprintf("{WAKTU_%d}", i)] = ""
			replaceMap[fmt.Sprintf("{PENGALAMAN_%d}", i)] = ""
			replaceMap[fmt.Sprintf("{KRITERIA_%d}", i)] = ""
			replaceMap[fmt.Sprintf("{PENILAIAN_%d}", i)] = ""
			replaceMap[fmt.Sprintf("{BOBOT_%d}", i)] = ""
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
		CourseID *uuid.UUID      `json:"course_id"`
		Result   json.RawMessage `json:"result"`
		Status   string          `json:"status"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		log.Printf("ERROR Create RPS - Failed to bind JSON: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	log.Printf("Create RPS - CourseID: %v, Status: %s, Result length: %d", input.CourseID, input.Status, len(input.Result))

	// Jika Result kosong, set ke empty JSON object
	resultData := input.Result
	if len(resultData) == 0 {
		resultData = []byte("{}")
	}

	rps := models.GeneratedRPS{
		CourseID: input.CourseID,
		Result:   []byte(resultData),
		Status:   input.Status,
	}

	if err := gc.db.Create(&rps).Error; err != nil {
		log.Printf("ERROR Create RPS - Failed to create in DB: %v", err)
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
		Result json.RawMessage `json:"result"`
		Status string          `json:"status"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if input.Result != nil {
		rps.Result = []byte(input.Result)
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
