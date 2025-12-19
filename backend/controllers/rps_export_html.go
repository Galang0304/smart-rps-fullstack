package controllers

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"html/template"
	"io/ioutil"
	"log"
	"net/http"
	"path/filepath"
	"sort"
	"strings"
	"time"

	"smart-rps-backend/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// RPSTemplateData struktur data untuk template RPS
type RPSTemplateData struct {
	// Header Institusi
	PerguruanTinggi string
	Fakultas        string
	ProgramStudi    string
	LogoBase64      string

	// Info Mata Kuliah
	NamaMataKuliah string
	KodeMK         string
	RumpunMK       string
	BobotSKS       int
	Semester       int
	TglPenyusunan  string

	// Info Fakultas & Dosen
	UPMFakultas     string
	NamaPenyusunRPS string
	KoordinatorRMK  string
	KaProdi         string
	NamaDosen       string

	// Capaian Pembelajaran
	CPLList          []CPLItem
	CPMKList         []CPMKItem
	SubCPMKDeskripsi string
	SubCPMKHeaders   []string
	CPMKKorelasi     []CPMKKorelasiItem

	// Konten
	DeskripsiMK string
	BahanKajian string
	Referensi   string

	// Rencana Pembelajaran & Tugas
	RencanaMingguan []RencanaMingguanItem
	RencanaTugas    []RencanaTugasItem
	SubCPMKList     []SubCPMKItem

	// Analisis Ketercapaian
	AnalisisKetercapaian []AnalisisKetercapaianItem
}

type CPLItem struct {
	Kode      string
	Deskripsi string
}

type CPMKItem struct {
	Kode      string
	Deskripsi string
	CPL       string // CPL yang terhubung dengan CPMK ini
}

type SubCPMKItem struct {
	Kode      string
	Deskripsi string
	CPMK      string
}

type CPMKKorelasiItem struct {
	CPMKKode string
	Korelasi []bool // true = ada korelasi, false = tidak ada
}

type RencanaMingguanItem struct {
	Minggu    int
	CPMK      string
	SubCPMK   string
	Indikator string
	Materi    string
	Metode    string
	Waktu     string
	Penilaian string
	Bobot     string
}

type RencanaTugasItem struct {
	TugasKe            int
	SubCPMK            string
	Indikator          string
	JudulTugas         string
	BatasWaktu         string
	PetunjukPengerjaan string
	LuaranTugas        string
	KriteriaPenilaian  string
	TeknikPenilaian    string
	BobotPersen        string
	DaftarRujukan      string
}

type AnalisisKetercapaianItem struct {
	Minggu         string // Changed to string to support ranges like "2-4"
	CPL            string
	CPMK           string
	SubCPMK        string
	TopikMateri    string
	JenisAssessmen string
	Bobot          string
}

// LoadLogoBase64 membaca file logo dan mengkonversi ke base64
func LoadLogoBase64() string {
	logoPath := filepath.Join("templates", "logo.png")

	// Coba beberapa nama file yang mungkin
	possiblePaths := []string{
		logoPath,
		filepath.Join("templates", "Logo.png"),
		filepath.Join("templates", "LOGO.png"),
	}

	for _, path := range possiblePaths {
		if data, err := ioutil.ReadFile(path); err == nil {
			return base64.StdEncoding.EncodeToString(data)
		}
	}

	log.Printf("Logo file not found, using empty string")
	return ""
}

// ExportHTML exports RPS to HTML format
func (gc *GeneratedRPSController) ExportHTML(c *gin.Context) {
	id := c.Param("id")
	rpsID, err := uuid.Parse(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid RPS ID"})
		return
	}

	// Load RPS with relations
	var rps models.GeneratedRPS
	if err := gc.db.Preload("Course", func(db *gorm.DB) *gorm.DB {
		return db.Unscoped()
	}).Preload("Course.Program", func(db *gorm.DB) *gorm.DB {
		return db.Unscoped()
	}).Preload("Course.Program.Prodi", func(db *gorm.DB) *gorm.DB {
		return db.Unscoped()
	}).First(&rps, "id = ?", rpsID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "RPS not found"})
		return
	}

	// Safety check
	if rps.Course == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Course not found for this RPS"})
		return
	}

	// Get Dosen info
	var dosens []models.Dosen
	gc.db.Preload("Prodi").
		Joins("JOIN dosen_courses ON dosen_courses.dosen_id = dosens.id").
		Where("dosen_courses.course_id = ?", rps.CourseID).
		Find(&dosens)

	// Parse result JSON
	var result map[string]interface{}
	if err := json.Unmarshal(rps.Result, &result); err != nil {
		log.Printf("ERROR ExportHTML - Failed to parse RPS data: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse RPS data"})
		return
	}

	// Prepare template data
	templateData := prepareTemplateData(gc.db, &rps, dosens, result)

	// Load template
	tmplPath := filepath.Join("templates", "rps_template.html")
	tmpl, err := template.New("rps_template.html").Funcs(template.FuncMap{
		"add": func(a, b int) int {
			return a + b
		},
	}).ParseFiles(tmplPath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load template: " + err.Error()})
		return
	}

	// Render HTML
	c.Header("Content-Type", "text/html; charset=utf-8")
	c.Header("Content-Disposition", "inline")

	if err := tmpl.Execute(c.Writer, templateData); err != nil {
		log.Printf("ERROR ExportHTML - Failed to execute template: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to render template"})
		return
	}
}

// prepareTemplateData menyiapkan data untuk template
func prepareTemplateData(db *gorm.DB, rps *models.GeneratedRPS, dosens []models.Dosen, result map[string]interface{}) RPSTemplateData {
	data := RPSTemplateData{
		// Header Institusi
		PerguruanTinggi: "Universitas Muhammadiyah Makassar",
		LogoBase64:      LoadLogoBase64(),

		// Info Mata Kuliah
		NamaMataKuliah: rps.Course.Title,
		KodeMK:         rps.Course.Code,
		RumpunMK:       "-",
		TglPenyusunan:  time.Now().Format("02/01/2006"),
	}

	// Set credits and semester
	if rps.Course.Credits != nil {
		data.BobotSKS = *rps.Course.Credits
	}
	if rps.Course.Semester != nil {
		data.Semester = *rps.Course.Semester
	}

	// Get Fakultas & Program Studi
	if rps.Course.Program != nil {
		data.ProgramStudi = rps.Course.Program.Name
		if rps.Course.Program.Prodi != nil {
			data.Fakultas = rps.Course.Program.Prodi.Fakultas
			data.KaProdi = rps.Course.Program.Prodi.NamaKaprodi
		}
	}

	// Get Dosen info
	if len(dosens) > 0 {
		data.NamaPenyusunRPS = dosens[0].NamaLengkap
		data.NamaDosen = dosens[0].NamaLengkap
		if dosens[0].Prodi != nil && data.Fakultas == "" {
			data.Fakultas = dosens[0].Prodi.Fakultas
		}
	}

	// Default values
	data.UPMFakultas = "-"
	data.KoordinatorRMK = "-"

	// Parse CPL data from database
	var cplList []models.CPL

	log.Printf("[DEBUG] Checking CPL query conditions...")

	// Query CPL berdasarkan Program → Prodi relation
	if rps.Course.Program != nil {
		log.Printf("[DEBUG] Program found: %s (ID: %s, code: %s)", rps.Course.Program.Name, rps.Course.Program.ID, rps.Course.Program.Code)
		log.Printf("[DEBUG] Program.ProdiID: %v", rps.Course.Program.ProdiID)

		// Coba ambil ProdiID langsung dari Program jika ada
		var prodiID *uuid.UUID
		if rps.Course.Program.ProdiID != nil && *rps.Course.Program.ProdiID != uuid.Nil {
			prodiID = rps.Course.Program.ProdiID
			log.Printf("[DEBUG] Using ProdiID from Program.ProdiID: %s", *prodiID)
		} else {
			// Fallback: Query prodi dari program
			var program models.Program
			if err := db.Preload("Prodi").First(&program, "id = ?", rps.Course.Program.ID).Error; err == nil && program.Prodi != nil {
				prodiID = &program.Prodi.ID
				log.Printf("[DEBUG] Loaded Prodi from Program: %s (ID: %s)", program.Prodi.NamaProdi, *prodiID)
			} else {
				log.Printf("[DEBUG] WARNING: Cannot load Prodi for Program: %v", err)
			}
		}

		if prodiID != nil && *prodiID != uuid.Nil {
			// Query CPL dengan prodi_id
			db.Where("prodi_id = ?", prodiID).
				Order("kode_cpl ASC").
				Find(&cplList)
			log.Printf("[DEBUG] Found %d CPL records from database", len(cplList))

			for _, cpl := range cplList {
				data.CPLList = append(data.CPLList, CPLItem{
					Kode:      cpl.KodeCPL,
					Deskripsi: cpl.CPL,
				})
			}
		} else {
			log.Printf("[DEBUG] WARNING: ProdiID is nil or empty")
		}
	} else {
		log.Printf("[DEBUG] WARNING: Program is nil")
	}
	log.Printf("[DEBUG] Final CPLList length: %d", len(data.CPLList))

	// Parse CPMK data from DATABASE (bukan dari JSON)
	var cpmkListDB []models.CPMK
	db.Where("course_id = ?", rps.CourseID).
		Order("cpmk_number ASC").
		Preload("SubCPMKs").
		Find(&cpmkListDB)

	// Parse matched_cpl dari JSON result untuk mapping CPMK ke CPL
	cpmkToCPLMap := make(map[string]string) // map[CPMK-1] = CPL-01,CPL-06
	log.Printf("[DEBUG] Parsing matched_cpl from JSON result...")
	if cpmkData, ok := result["cpmk"].([]interface{}); ok {
		log.Printf("[DEBUG] Found %d CPMK entries in JSON", len(cpmkData))
		for i, cpmk := range cpmkData {
			if cpmkMap, ok := cpmk.(map[string]interface{}); ok {
				cpmkCode := getStringOrDefault(cpmkMap, "code", "")

				// Try to get matched_cpl (string) or selected_cpls (array)
				var matchedCPL string

				// First try: matched_cpl (string format dari database)
				if val, exists := cpmkMap["matched_cpl"]; exists && val != nil {
					matchedCPL = fmt.Sprintf("%v", val)
				}

				// Second try: selected_cpls (array format dari frontend)
				if matchedCPL == "" {
					if selectedCPLs, ok := cpmkMap["selected_cpls"].([]interface{}); ok && len(selectedCPLs) > 0 {
						cplStrings := make([]string, 0, len(selectedCPLs))
						for _, cpl := range selectedCPLs {
							if cplStr := fmt.Sprintf("%v", cpl); cplStr != "" {
								cplStrings = append(cplStrings, cplStr)
							}
						}
						if len(cplStrings) > 0 {
							matchedCPL = strings.Join(cplStrings, ",")
						}
					}
				}

				log.Printf("[DEBUG] CPMK[%d]: code=%s, matched_cpl=%s", i, cpmkCode, matchedCPL)
				if cpmkCode != "" && matchedCPL != "" {
					cpmkToCPLMap[cpmkCode] = matchedCPL
					log.Printf("[DEBUG] ✅ Added mapping: %s → %s", cpmkCode, matchedCPL)
				} else {
					log.Printf("[DEBUG] ⚠️ Skipped CPMK[%d]: empty code or CPL", i)
				}
			}
		}
	} else {
		log.Printf("[DEBUG] WARNING: 'cpmk' field not found or not an array in JSON result")
	}
	log.Printf("[DEBUG] Total CPMK-CPL mappings: %d", len(cpmkToCPLMap))

	// Build CPMK List
	for _, cpmk := range cpmkListDB {
		cpmkCode := "CPMK-" + fmt.Sprintf("%d", cpmk.CPMKNumber)

		// Get CPL dari mapping
		cplString := ""
		if mappedCPL, exists := cpmkToCPLMap[cpmkCode]; exists {
			cplString = mappedCPL
			log.Printf("[DEBUG] ✓ CPMK %s has CPL: %s", cpmkCode, cplString)
		} else {
			log.Printf("[DEBUG] ⚠️ CPMK %s has no CPL mapping", cpmkCode)
		}

		data.CPMKList = append(data.CPMKList, CPMKItem{
			Kode:      cpmkCode,
			Deskripsi: cpmk.Description,
			CPL:       cplString,
		})
	}

	// Parse Sub-CPMK data from DATABASE (bukan dari JSON)
	var subCpmkListDB []models.SubCPMK
	if len(cpmkListDB) > 0 {
		var cpmkIds []uuid.UUID
		for _, cpmk := range cpmkListDB {
			cpmkIds = append(cpmkIds, cpmk.ID)
		}

		db.Where("cpmk_id IN ?", cpmkIds).
			Order("sub_cpmk_number ASC").
			Preload("CPMK").
			Find(&subCpmkListDB)

		// Build SubCPMK List dengan relasi CPMK yang benar
		for _, subCpmk := range subCpmkListDB {
			subKode := "Sub-CPMK-" + fmt.Sprintf("%d", subCpmk.SubCPMKNumber)
			cpmkKode := "CPMK-" + fmt.Sprintf("%d", subCpmk.CPMK.CPMKNumber)

			data.SubCPMKHeaders = append(data.SubCPMKHeaders, subKode)
			data.SubCPMKList = append(data.SubCPMKList, SubCPMKItem{
				Kode:      subKode,
				Deskripsi: subCpmk.Description,
				CPMK:      cpmkKode,
			})
		}
	}

	// Build CPMK-SubCPMK correlation based on database relationship
	for _, cpmk := range data.CPMKList {
		korelasi := make([]bool, len(data.SubCPMKHeaders))
		// Check each SubCPMK if it relates to this CPMK
		for i, subCpmk := range data.SubCPMKList {
			if subCpmk.CPMK == cpmk.Kode {
				korelasi[i] = true
			}
		}
		data.CPMKKorelasi = append(data.CPMKKorelasi, CPMKKorelasiItem{
			CPMKKode: cpmk.Kode,
			Korelasi: korelasi,
		})
	}

	// Get content from result
	data.DeskripsiMK = getStringOrDefault(result, "deskripsi", "")
	data.BahanKajian = getBahanKajianFromResult(result)
	data.Referensi = getReferensiFromResult(result)

	// Build Sub-CPMK map untuk lookup indikator (description)
	subCpmkToIndikator := make(map[string]string) // map["Sub-CPMK-1"] = "Description/Indikator"
	for _, subCpmk := range subCpmkListDB {
		subKode := "Sub-CPMK-" + fmt.Sprintf("%d", subCpmk.SubCPMKNumber)
		subCpmkToIndikator[subKode] = subCpmk.Description
	}
	log.Printf("[DEBUG] Built Sub-CPMK to Indikator map with %d entries", len(subCpmkToIndikator))

	// Parse Rencana Mingguan
	if rencanaMingguan, ok := result["rencanaMingguan"].([]interface{}); ok {
		for _, item := range rencanaMingguan {
			if itemMap, ok := item.(map[string]interface{}); ok {
				minggu := 0
				if m, ok := itemMap["minggu"].(float64); ok {
					minggu = int(m)
				}

				subCpmkKode := getStringOrDefault(itemMap, "subCpmk", "")

				// Ambil indikator dari JSON, jika kosong ambil dari Sub-CPMK database
				indikator := getStringOrDefault(itemMap, "indikator", "")
				if indikator == "" && subCpmkKode != "" {
					if indikatorFromDB, exists := subCpmkToIndikator[subCpmkKode]; exists {
						indikator = indikatorFromDB
						log.Printf("[DEBUG] Using Sub-CPMK description as indikator for %s", subCpmkKode)
					}
				}

				data.RencanaMingguan = append(data.RencanaMingguan, RencanaMingguanItem{
					Minggu:    minggu,
					CPMK:      getStringOrDefault(itemMap, "cpmk", ""),
					SubCPMK:   subCpmkKode,
					Indikator: indikator,
					Materi:    getStringOrDefault(itemMap, "materi", ""),
					Metode:    getStringOrDefault(itemMap, "metode", ""),
					Penilaian: getStringOrDefault(itemMap, "penilaian", ""),
					Waktu:     "150", // default waktu per minggu
					Bobot:     "7%",  // default bobot
				})
			}
		}
	}

	// Pastikan ada 16 minggu lengkap, isi minggu 15 dengan Sub-CPMK-14 dan minggu 16 dengan UAS
	weekMap := make(map[int]bool)
	for _, item := range data.RencanaMingguan {
		weekMap[item.Minggu] = true
	}

	// Jika minggu 15 tidak ada, tambahkan dengan Sub-CPMK-14
	if !weekMap[15] {
		// Cari Sub-CPMK-14 dari database
		subCpmk14Desc := ""
		for _, subCpmk := range data.SubCPMKList {
			if subCpmk.Kode == "Sub-CPMK-14" {
				subCpmk14Desc = subCpmk.Deskripsi
				break
			}
		}
		data.RencanaMingguan = append(data.RencanaMingguan, RencanaMingguanItem{
			Minggu:    15,
			SubCPMK:   "Sub-CPMK-14",
			Indikator: subCpmk14Desc,
			Materi:    "Melanjutkan materi pertemuan sebelumnya",
			Metode:    "Ceramah, Diskusi",
			Penilaian: "Tugas",
			Waktu:     "150",
			Bobot:     "7%",
		})
		log.Printf("[DEBUG] Added week 15 with Sub-CPMK-14")
	}

	// Sort RencanaMingguan berdasarkan minggu
	sort.Slice(data.RencanaMingguan, func(i, j int) bool {
		return data.RencanaMingguan[i].Minggu < data.RencanaMingguan[j].Minggu
	})

	// Parse Rencana Tugas FIRST (sebelum build Analisis Ketercapaian)
	if rencanaTugas, ok := result["rencanaTugas"].([]interface{}); ok {
		for _, item := range rencanaTugas {
			if itemMap, ok := item.(map[string]interface{}); ok {
				tugasKe := 0
				if order, ok := itemMap["order"].(float64); ok {
					tugasKe = int(order)
				}

				data.RencanaTugas = append(data.RencanaTugas, RencanaTugasItem{
					TugasKe:            tugasKe,
					SubCPMK:            getStringOrDefault(itemMap, "subCpmk", ""),
					Indikator:          getStringOrDefault(itemMap, "indikator", ""),
					JudulTugas:         getStringOrDefault(itemMap, "judulTugas", ""),
					BatasWaktu:         getStringOrDefault(itemMap, "batasWaktu", ""),
					PetunjukPengerjaan: getStringOrDefault(itemMap, "petunjukPengerjaan", ""),
					LuaranTugas:        getStringOrDefault(itemMap, "luaranTugas", ""),
					KriteriaPenilaian:  getStringOrDefault(itemMap, "kriteriaPenilaian", ""),
					TeknikPenilaian:    getStringOrDefault(itemMap, "teknikPenilaian", ""),
					BobotPersen:        getStringOrDefault(itemMap, "bobotPersen", "7%"),
					DaftarRujukan:      getStringOrDefault(itemMap, "daftarRujukan", ""),
				})
			}
		}
	}

	// Build Analisis Ketercapaian (combine rencanaMingguan + rencanaTugas)
	// Logika: Untuk setiap minggu, ambil SubCPMK dari rencanaMingguan,
	// lalu cari CPMK parent dan CPL yang terkait dari database + JSON mapping
	if len(data.RencanaMingguan) > 0 {
		for i, mingguanItem := range data.RencanaMingguan {
			// Default values
			cplKode := ""
			cpmkFull := ""
			subCpmkKode := mingguanItem.SubCPMK

			// Find SubCPMK di database berdasarkan kode dari rencanaMingguan
			// Format SubCPMK bisa "Sub-CPMK-1", "Sub-CPMK-2", dll
			for _, subCpmk := range data.SubCPMKList {
				if subCpmk.Kode == subCpmkKode {
					// Found! Ambil parent CPMK
					for _, cpmk := range data.CPMKList {
						if cpmk.Kode == subCpmk.CPMK {
							cpmkFull = cpmk.Kode + ": " + cpmk.Deskripsi

							// Ambil CPL dari mapping matched_cpl di JSON
							log.Printf("[DEBUG] Looking up CPL for CPMK: %s (CPLList len: %d)", cpmk.Kode, len(data.CPLList))
							if matchedCPL, exists := cpmkToCPLMap[cpmk.Kode]; exists {
								cplKode = matchedCPL
								log.Printf("[DEBUG] ✓ Found matched CPL: %s", matchedCPL)
							} else if len(data.CPLList) > 0 {
								// Fallback ke CPL pertama jika tidak ada mapping
								cplKode = data.CPLList[0].Kode
								log.Printf("[DEBUG] ⚠ No match, using fallback CPL: %s", cplKode)
							} else {
								log.Printf("[DEBUG] ✗ ERROR: No CPL mapping and CPLList is empty!")
							}
							log.Printf("[DEBUG] Final cplKode assigned: '%s'", cplKode)
							break
						}
					}
					break
				}
			}

			// Jika masih kosong, coba cari dari mingguanItem.CPMK langsung
			if cpmkFull == "" && mingguanItem.CPMK != "" {
				for _, cpmk := range data.CPMKList {
					if cpmk.Kode == mingguanItem.CPMK {
						if matchedCPL, exists := cpmkToCPLMap[cpmk.Kode]; exists {
							cplKode = matchedCPL
						} else if len(data.CPLList) > 0 {
							cplKode = data.CPLList[0].Kode
						}
						break
					}
				}
			}

			// Get assessment info from corresponding rencanaTugas (by index)
			jenisAssessmen := ""
			bobot := "7,14%" // default: 100/14
			if i < len(data.RencanaTugas) {
				jenisAssessmen = data.RencanaTugas[i].TeknikPenilaian
				if data.RencanaTugas[i].BobotPersen != "" {
					bobot = data.RencanaTugas[i].BobotPersen
				}
			}

			// Format minggu
			mingguStr := fmt.Sprintf("%d", mingguanItem.Minggu)

			data.AnalisisKetercapaian = append(data.AnalisisKetercapaian, AnalisisKetercapaianItem{
				Minggu:         mingguStr,
				CPL:            cplKode,
				CPMK:           cpmkFull,
				SubCPMK:        subCpmkKode,
				TopikMateri:    mingguanItem.Materi,
				JenisAssessmen: jenisAssessmen,
				Bobot:          bobot,
			})
		}
	}

	return data
}

// Helper functions
func getStringOrDefault(m map[string]interface{}, key string, defaultVal string) string {
	if val, ok := m[key]; ok {
		if str, ok := val.(string); ok {
			return str
		}
	}
	return defaultVal
}

func getBahanKajianFromResult(result map[string]interface{}) string {
	var kajian string
	if bahanKajianData, ok := result["bahanKajian"].([]interface{}); ok {
		for i, bahan := range bahanKajianData {
			if bahanStr, ok := bahan.(string); ok && bahanStr != "" {
				if i > 0 {
					kajian += "\n"
				}
				kajian += bahanStr
			}
		}
	}
	if kajian == "" {
		kajian = "-"
	}
	return kajian
}

func getReferensiFromResult(result map[string]interface{}) string {
	var referensi string
	if referensiData, ok := result["referensi"].([]interface{}); ok {
		for i, ref := range referensiData {
			if refStr, ok := ref.(string); ok && refStr != "" {
				if i > 0 {
					referensi += "\n"
				}
				referensi += refStr
			}
		}
	}

	if referensi == "" {
		referensi = "-"
	}
	return referensi
}
