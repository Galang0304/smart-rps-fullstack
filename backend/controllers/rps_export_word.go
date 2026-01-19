package controllers

import (
	"archive/zip"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"regexp"
	"strconv"
	"strings"
	"time"

	"smart-rps-backend/models"

	"github.com/gin-gonic/gin"
)

// ExportWord exports RPS using Word template with placeholder replacement
func (gc *GeneratedRPSController) ExportWord(c *gin.Context) {
	rpsID := c.Param("id")

	var rps models.GeneratedRPS
	err := gc.db.
		Preload("Course.Program.Prodi").
		Where("id = ?", rpsID).
		First(&rps).Error

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "RPS not found"})
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
		log.Printf("ERROR ExportWord - Failed to parse RPS data: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse RPS data"})
		return
	}

	// Prepare replacements map
	replacements := prepareWordReplacements(&rps, dosens, result)

	// Process template
	templatePath := filepath.Join("templates", "template_rps.docx")
	outputPath := filepath.Join("templates", "temp_docx", fmt.Sprintf("RPS_%s_%s.docx", rps.Course.Title, rpsID))

	err = processWordTemplate(templatePath, outputPath, replacements)
	if err != nil {
		log.Printf("Error processing template: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to generate document: %v", err)})
		return
	}

	// Send file
	filename := fmt.Sprintf("RPS_%s.docx", rps.Course.Title)
	// Sanitize filename - replace spaces and special characters
	filename = strings.ReplaceAll(filename, " ", "_")

	c.Header("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
	c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=\"%s\"", filename))

	// Ensure file exists before sending
	if _, err := os.Stat(outputPath); os.IsNotExist(err) {
		log.Printf("Error: Output file does not exist: %s", outputPath)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Generated file not found"})
		return
	}

	c.File(outputPath)
}

// processWordTemplate processes DOCX template by unzipping, replacing placeholders, and rezipping
func processWordTemplate(templatePath, outputPath string, replacements map[string]string) error {
	// Read template file
	reader, err := zip.OpenReader(templatePath)
	if err != nil {
		return fmt.Errorf("failed to open template: %w", err)
	}
	defer reader.Close()

	// Create output file
	outFile, err := os.Create(outputPath)
	if err != nil {
		return fmt.Errorf("failed to create output file: %w", err)
	}

	// Create zip writer
	zipWriter := zip.NewWriter(outFile)

	// Process each file in the zip
	for _, file := range reader.File {
		if err := processZipFile(file, zipWriter, replacements); err != nil {
			zipWriter.Close()
			outFile.Close()
			return err
		}
	}

	// IMPORTANT: Close zipWriter first to finalize the ZIP archive
	// This writes the central directory and ensures the file is complete
	if err := zipWriter.Close(); err != nil {
		outFile.Close()
		return fmt.Errorf("failed to finalize zip archive: %w", err)
	}

	// Then close the output file
	if err := outFile.Close(); err != nil {
		return fmt.Errorf("failed to close output file: %w", err)
	}

	return nil
}

// processZipFile processes individual file in the zip
func processZipFile(file *zip.File, zipWriter *zip.Writer, replacements map[string]string) error {
	fileReader, err := file.Open()
	if err != nil {
		return fmt.Errorf("failed to open file in zip: %w", err)
	}
	defer fileReader.Close()

	// Create file in output zip
	header := file.FileHeader
	writer, err := zipWriter.CreateHeader(&header)
	if err != nil {
		return fmt.Errorf("failed to create file in output zip: %w", err)
	}

	// Check if this is a content file that needs replacement
	needsReplacement := strings.Contains(file.Name, "document.xml") ||
		strings.Contains(file.Name, "header") ||
		strings.Contains(file.Name, "footer")

	if needsReplacement {
		// Read content
		content, err := io.ReadAll(fileReader)
		if err != nil {
			return fmt.Errorf("failed to read file content: %w", err)
		}

		contentStr := string(content)

		// Step 1: Execute Go template to handle {{range}}, {{if}}, etc
		contentStr = executeGoTemplate(contentStr, replacements)

		// Step 2: Aggressive placeholder fixing for remaining placeholders
		contentStr = fixBrokenPlaceholders(contentStr, replacements)

		// Log for debugging
		if strings.Contains(file.Name, "document.xml") {
			log.Printf("Processing document.xml")
		}

		// Write modified content
		_, err = writer.Write([]byte(contentStr))
		if err != nil {
			return fmt.Errorf("failed to write modified content: %w", err)
		}
	} else {
		// Copy file as-is
		_, err = io.Copy(writer, fileReader)
		if err != nil {
			return fmt.Errorf("failed to copy file: %w", err)
		}
	}

	return nil
}

// executeGoTemplate removes Go template constructs that can't be properly rendered
func executeGoTemplate(content string, replacements map[string]string) string {
	// Remove {{range}} constructs - keep content inside but remove loop logic
	// Pattern: {{range .Something}} ... {{end}}
	rangePattern := regexp.MustCompile(`(?s)\{\{range[^}]*\}\}`)
	content = rangePattern.ReplaceAllString(content, "")

	// Remove {{end}} tags
	content = strings.ReplaceAll(content, "{{end}}", "")

	// Remove {{if}} constructs
	ifPattern := regexp.MustCompile(`\{\{if[^}]*\}\}`)
	content = ifPattern.ReplaceAllString(content, "")

	// Remove {{else}} tags
	content = strings.ReplaceAll(content, "{{else}}", "")

	// Remove range dash variants
	content = strings.ReplaceAll(content, "{{range-", "")

	// Clean up any broken template syntax
	// Pattern: {{ .FieldName }} with spaces
	spacedPattern := regexp.MustCompile(`\{\{\s*\.\s*([A-Za-z0-9\s]+)\s*\}\}`)
	matches := spacedPattern.FindAllStringSubmatch(content, -1)
	for _, match := range matches {
		original := match[0]
		fieldName := strings.ReplaceAll(match[1], " ", "")

		// Try to find replacement
		possibleKeys := []string{
			"{{." + fieldName + "}}",
			"{{" + fieldName + "}}",
			"{{." + strings.Title(fieldName) + "}}",
		}

		for _, key := range possibleKeys {
			if val, ok := replacements[key]; ok {
				content = strings.ReplaceAll(content, original, val)
				break
			}
		}
	}

	return content
}

// prepareWordReplacements prepares all placeholder replacements for Word template
func prepareWordReplacements(rps *models.GeneratedRPS, dosens []models.Dosen, result map[string]interface{}) map[string]string {
	replacements := make(map[string]string)

	// Basic course info - Support multiple formats: {{FIELD}}, {{.Field}}, {{$.Field}}
	replacements["{{NAMA_MK}}"] = rps.Course.Title
	replacements["{{.NamaMataKuliah}}"] = rps.Course.Title
	replacements["{{NamaMataKuliah}}"] = rps.Course.Title
	replacements["{{$.NamaMataKuliah}}"] = rps.Course.Title

	replacements["{{KODE_MK}}"] = rps.Course.Code
	replacements["{{.Kode MK}}"] = rps.Course.Code
	replacements["{{.KodeMK}}"] = rps.Course.Code
	replacements["{{Kode MK}}"] = rps.Course.Code
	replacements["{{$.KodeMK}}"] = rps.Course.Code
	replacements["{{KodeMK}}"] = rps.Course.Code
	// Broken XML placeholder for KodeMK
	replacements["{{.Kode </w:t></w:r><w:r><w:rPr><w:spacing w:val=\"-4\"/><w:sz w:val=\"20\"/></w:rPr><w:t>MK}}"] = rps.Course.Code

	replacements["{{RUMPUN_MK}}"] = "Teknik Informatika"
	replacements["{{.RumpunMK}}"] = "Teknik Informatika"
	replacements["{{.RumpunM K}}"] = "Teknik Informatika"
	replacements["{{RumpunMK}}"] = "Teknik Informatika"
	replacements["{{$.RumpunMK}}"] = "Teknik Informatika"
	// Broken XML placeholder for RumpunMK
	replacements["{{.RumpunM </w:t></w:r><w:r><w:rPr><w:spacing w:val=\"-4\"/><w:sz w:val=\"20\"/></w:rPr><w:t>K}}"] = "Teknik Informatika"

	if rps.Course.Credits != nil {
		sks := strconv.Itoa(*rps.Course.Credits)
		replacements["{{SKS}}"] = sks
		replacements["{{.BobotSKS}}"] = sks
		replacements["{{.Bobot(SKS)}}"] = sks
		replacements["{{Bobot(SKS)}}"] = sks
		replacements["{{BobotSKS}}"] = sks
		replacements["{{BOBOT}}"] = sks
		replacements["{{$.BobotSKS}}"] = sks
	} else {
		replacements["{{SKS}}"] = "0"
		replacements["{{.BobotSKS}}"] = "0"
		replacements["{{.Bobot(SKS)}}"] = "0"
		replacements["{{Bobot(SKS)}}"] = "0"
		replacements["{{BobotSKS}}"] = "0"
		replacements["{{BOBOT}}"] = "0"
		replacements["{{$.BobotSKS}}"] = "0"
	}

	if rps.Course.Semester != nil {
		sem := strconv.Itoa(*rps.Course.Semester)
		replacements["{{SEMESTER}}"] = sem
		replacements["{{.Semester}}"] = sem
		replacements["{{Semester}}"] = sem
		replacements["{{$.Semester}}"] = sem
	} else {
		replacements["{{SEMESTER}}"] = "-"
		replacements["{{.Semester}}"] = "-"
		replacements["{{Semester}}"] = "-"
		replacements["{{$.Semester}}"] = "-"
	}

	// TGL Penyusunan (tanggal sekarang)
	currentDate := time.Now().Format("02 January 2006")
	replacements["{{.TglPenyusunan}}"] = currentDate
	replacements["{{TglPenyusunan}}"] = currentDate
	replacements["{{TGL_PENYUSUNAN}}"] = currentDate
	replacements["{{$.TglPenyusunan}}"] = currentDate
	// Broken variants
	replacements["{{.Tgl Penyusunan}}"] = currentDate
	replacements["{{.TglPenyusunan }}"] = currentDate
	replacements["{{.TglPenyusunan}"] = currentDate
	replacements["{.TglPenyusunan}}"] = currentDate

	// Program info
	if rps.Course.Program != nil {
		replacements["{{PROGRAM_STUDI}}"] = rps.Course.Program.Name
		replacements["{{PROGRAM STUDI}}"] = rps.Course.Program.Name
		if rps.Course.Program.Prodi != nil {
			replacements["{{FAKULTAS}}"] = rps.Course.Program.Prodi.Fakultas
		}
	}

	// Dosen info
	var dosenNames []string
	for _, d := range dosens {
		dosenNames = append(dosenNames, d.NamaLengkap)
	}
	dosenStr := strings.Join(dosenNames, ", ")
	if dosenStr == "" {
		dosenStr = "-"
	}
	replacements["{{DOSEN}}"] = dosenStr
	replacements["{{.KaProdi}}"] = dosenStr
	replacements["{{KaProd}}"] = dosenStr
	replacements["{{KaProdi}}"] = dosenStr
	replacements["{{.KoordinatorRMK}}"] = dosenStr
	replacements["{{KOORDINATOR RMK}}"] = dosenStr
	replacements["{{KoordinatorRMK}}"] = dosenStr

	// UPM Fakultas & Penyusun - include all broken variants
	replacements["{{.UPMFakultas}}"] = dosenStr
	replacements["{{.NamaPenyusunRPS}}"] = dosenStr
	replacements["{{NAMA_PENYU_SUN_RPS}}"] = dosenStr
	replacements["{{KOORDINATOR_RMK}}"] = dosenStr
	// Broken variants for NamaPenyusunRPS
	replacements["{{.Nam aPenyus unRPS}}"] = dosenStr
	replacements["{{.NamaPenyusunRPS}}"] = dosenStr
	replacements["{{.Nam aPenyusunRPS}}"] = dosenStr
	replacements["{{.NamaPenyus unRPS}}"] = dosenStr
	replacements["{{.NamaPenyusun RPS}}"] = dosenStr
	replacements["{{.Na maPenyusunRPS}}"] = dosenStr
	replacements["{{.NamaPe nyusunRPS}}"] = dosenStr
	replacements["{{. NamaPenyusunRPS}}"] = dosenStr
	replacements["{{.N amaPenyusunRPS}}"] = dosenStr

	// CPL (Capaian Pembelajaran Lulusan)
	if cplData, ok := result["cpl"].([]interface{}); ok {
		var cplList []string
		var cplCodes []string
		for i, cpl := range cplData {
			if cplMap, ok := cpl.(map[string]interface{}); ok {
				code := fmt.Sprintf("CPL-%d", i+1)
				if cplCode, ok := cplMap["code"].(string); ok {
					code = cplCode
				}
				cplCodes = append(cplCodes, code)
				desc := ""
				if cplDesc, ok := cplMap["description"].(string); ok {
					desc = cplDesc
				}
				cplList = append(cplList, fmt.Sprintf("%s: %s", code, desc))
			}
		}
		replacements["{{CPL}}"] = strings.Join(cplList, "\n")
		replacements["{{range CPLList}}"] = strings.Join(cplCodes, ", ")
		replacements["{{end}}"] = ""
	}

	// CPMK (Capaian Pembelajaran Mata Kuliah)
	if cpmkData, ok := result["cpmk"].([]interface{}); ok {
		var cpmkList []string
		var cpmkCodes []string
		var cpmkDesc []string
		for _, cpmk := range cpmkData {
			if cpmkMap, ok := cpmk.(map[string]interface{}); ok {
				code := ""
				if cpmkCode, ok := cpmkMap["code"].(string); ok {
					code = cpmkCode
				}
				cpmkCodes = append(cpmkCodes, code)
				desc := ""
				if cpmkDesc, ok := cpmkMap["description"].(string); ok {
					desc = cpmkDesc
				}
				cpmkDesc = append(cpmkDesc, desc)
				cpmkList = append(cpmkList, fmt.Sprintf("%s: %s", code, desc))
			}
		}
		replacements["{{CPMK}}"] = strings.Join(cpmkList, "\n")
		replacements["{{.Kode}}"] = strings.Join(cpmkCodes, ", ")
		replacements["{{Kode}}"] = strings.Join(cpmkCodes, ", ")
		replacements["{{.Deskripsi}}"] = strings.Join(cpmkDesc, "\n")
		replacements["{{Deskripsi}}"] = strings.Join(cpmkDesc, "\n")
		replacements["{{if CPL}}"] = strings.Join(cpmkCodes, ", ")
		replacements["{{.CPL}}"] = strings.Join(cpmkCodes, ", ")
		replacements["{{.CPMK}}"] = strings.Join(cpmkCodes, ", ")
		replacements["{{.SubCPMK}}"] = strings.Join(cpmkCodes, ", ")
		replacements["{{.CPMKKode}}"] = strings.Join(cpmkCodes, ", ")
	}

	// Deskripsi Mata Kuliah
	if desc, ok := result["deskripsi_mk"].(string); ok {
		replacements["{{DESKRIPSI_MK}}"] = desc
		replacements["{{.DeskripsiMK}}"] = desc
		replacements["{{DeskripsiMK}}"] = desc
	}

	// Bahan Kajian / Topik
	if bahan, ok := result["bahan_kajian"].(string); ok {
		replacements["{{.BahanKajian}}"] = bahan
		replacements["{{BahanKajian}}"] = bahan
	} else {
		replacements["{{.BahanKajian}}"] = "-"
		replacements["{{BahanKajian}}"] = "-"
	}

	// Prasyarat
	if prasyarat, ok := result["prasyarat"].(string); ok {
		replacements["{{PRASYARAT}}"] = prasyarat
	} else {
		replacements["{{PRASYARAT}}"] = "Tidak ada"
	}

	// Referensi
	if referensi, ok := result["referensi"].([]interface{}); ok {
		var refList []string
		for i, ref := range referensi {
			refList = append(refList, fmt.Sprintf("%d. %v", i+1, ref))
		}
		replacements["{{REFERENSI}}"] = strings.Join(refList, "\n")
		replacements["{{.Referensi}}"] = strings.Join(refList, "\n")
		replacements["{{Referensi}}"] = strings.Join(refList, "\n")
	}

	// Media Pembelajaran
	if media, ok := result["media_pembelajaran"].(string); ok {
		replacements["{{MEDIA}}"] = media
	}

	// Nama Dosen
	replacements["{{.NamaDosen}}"] = dosenStr
	replacements["{{NamaDosen}}"] = dosenStr

	// Rencana Mingguan - populate actual data if exists
	if rencanaMingguan, ok := result["rencana_mingguan"].([]interface{}); ok && len(rencanaMingguan) > 0 {
		// For first entry, use actual data
		if minggu, ok := rencanaMingguan[0].(map[string]interface{}); ok {
			if mg, ok := minggu["minggu"].(float64); ok {
				replacements["{{.Minggu}}"] = fmt.Sprintf("%.0f", mg)
				replacements["{{. M in gg u}}"] = fmt.Sprintf("%.0f", mg)
			}
			if waktu, ok := minggu["waktu"].(string); ok {
				replacements["{{.Waktu}}"] = waktu
				replacements["{{.Wa ktu}}"] = waktu
			}
			if materi, ok := minggu["topik_materi"].(string); ok {
				replacements["{{.Materi}}"] = materi
			}
			if metode, ok := minggu["metode_pembelajaran"].(string); ok {
				replacements["{{.Metode}}"] = metode
			}
		}
	}

	// Rencana Tugas
	if tugasData, ok := result["rencana_tugas"].([]interface{}); ok && len(tugasData) > 0 {
		// Set TugasKe as "1" for the first task
		replacements["{{.TugasKe}}"] = "1"

		if tugas, ok := tugasData[0].(map[string]interface{}); ok {
			if judul, ok := tugas["judul"].(string); ok {
				replacements["{{.JudulTugas}}"] = judul
			}
			if batas, ok := tugas["batas_waktu"].(string); ok {
				replacements["{{.BatasWaktu}}"] = batas
			}
			if petunjuk, ok := tugas["petunjuk"].(string); ok {
				replacements["{{.PetunjukPengerjaan}}"] = petunjuk
			}
			if luaran, ok := tugas["luaran"].(string); ok {
				replacements["{{.LuaranTugas}}"] = luaran
			}
			if kriteria, ok := tugas["kriteria_penilaian"].(string); ok {
				replacements["{{.KriteriaPenilaian}}"] = kriteria
			}
			if teknik, ok := tugas["teknik_penilaian"].(string); ok {
				replacements["{{.TeknikPenilaian}}"] = teknik
			}
			if bobot, ok := tugas["bobot_persen"].(float64); ok {
				replacements["{{.BobotPersen}}"] = fmt.Sprintf("%.0f%%", bobot)
			}
			if rujukan, ok := tugas["rujukan"].(string); ok {
				replacements["{{.DaftarRujukan}}"] = rujukan
			}
		}
	} else {
		// Default if no tugas data
		replacements["{{.TugasKe}}"] = "1"
	}

	// Analisis Penilaian
	if analisisPenilaian, ok := result["analisis_penilaian"].([]interface{}); ok && len(analisisPenilaian) > 0 {
		if penilaian, ok := analisisPenilaian[0].(map[string]interface{}); ok {
			if minggu, ok := penilaian["minggu"].(float64); ok {
				replacements["{{.Minggu}}"] = fmt.Sprintf("%.0f", minggu)
				replacements["{{.Mi nggu}}"] = fmt.Sprintf("%.0f", minggu)
			}
			if topik, ok := penilaian["topik_materi"].(string); ok {
				replacements["{{.TopikMateri}}"] = topik
			}
			if jenis, ok := penilaian["jenis_assessment"].(string); ok {
				replacements["{{.JenisAssessmen}}"] = jenis
			}
			if bobot, ok := penilaian["bobot"].(float64); ok {
				replacements["{{.Bobot}}"] = fmt.Sprintf("%.0f", bobot)
				replacements["{{.Bob ot}}"] = fmt.Sprintf("%.0f", bobot)
			}
		}
	}

	// Default placeholder untuk iterasi (range/end)
	replacements["{{range}}"] = ""
	replacements["{{end}}"] = ""
	replacements["{{range .RencanaTugas}}"] = ""
	replacements["{{range $index, $header := .SubCPMKHeaders}}"] = ""
	replacements["{{range .CPMKKorelasi}}"] = ""
	replacements["{{range .Korelasi}}"] = ""
	replacements["{{range-"] = ""
	replacements["{{if .CPL}}"] = ""
	replacements["{{if.CPL}}"] = ""
	replacements["{{if .}}"] = ""
	replacements["{{if.}}"] = ""
	replacements["({{.CPL}})"] = ""
	replacements["S-{{add $index 1}}"] = "S-1"
	replacements["{{if .}}✓{{end}}"] = "✓"

	// Default values for Rencana Tugas fields
	if _, exists := replacements["{{.JudulTugas}}"]; !exists {
		replacements["{{.JudulTugas}}"] = "-"
	}
	if _, exists := replacements["{{.BatasWaktu}}"]; !exists {
		replacements["{{.BatasWaktu}}"] = "-"
	}
	if _, exists := replacements["{{.PetunjukPengerjaan}}"]; !exists {
		replacements["{{.PetunjukPengerjaan}}"] = "-"
	}
	if _, exists := replacements["{{.LuaranTugas}}"]; !exists {
		replacements["{{.LuaranTugas}}"] = "-"
	}
	if _, exists := replacements["{{.KriteriaPenilaian}}"]; !exists {
		replacements["{{.KriteriaPenilaian}}"] = "-"
	}
	if _, exists := replacements["{{.TeknikPenilaian}}"]; !exists {
		replacements["{{.TeknikPenilaian}}"] = "-"
	}
	if _, exists := replacements["{{.BobotPersen}}"]; !exists {
		replacements["{{.BobotPersen}}"] = "-"
	}
	if _, exists := replacements["{{.DaftarRujukan}}"]; !exists {
		replacements["{{.DaftarRujukan}}"] = "-"
	}

	// Default values for Deskripsi MK
	if _, exists := replacements["{{.DeskripsiMK}}"]; !exists {
		replacements["{{.DeskripsiMK}}"] = "-"
	}

	// Default values for TopikMateri and JenisAssessmen
	if _, exists := replacements["{{.TopikMateri}}"]; !exists {
		replacements["{{.TopikMateri}}"] = "-"
	}
	if _, exists := replacements["{{.JenisAssessmen}}"]; !exists {
		replacements["{{.JenisAssessmen}}"] = "-"
	}

	// Default values for table fields if not set
	if _, exists := replacements["{{.Minggu}}"]; !exists {
		replacements["{{.Minggu}}"] = "-"
	}
	// Broken Minggu variants
	replacements["{{. M in gg u}}"] = replacements["{{.Minggu}}"]
	replacements["{{.M inggu}}"] = replacements["{{.Minggu}}"]
	replacements["{{.Mi nggu}}"] = replacements["{{.Minggu}}"]
	replacements["{{.Min ggu}}"] = replacements["{{.Minggu}}"]
	replacements["{{.Ming gu}}"] = replacements["{{.Minggu}}"]
	replacements["{{.Mingg u}}"] = replacements["{{.Minggu}}"]
	replacements["{{.- Minggu}}"] = replacements["{{.Minggu}}"]
	replacements["{{.in gg u}}"] = replacements["{{.Minggu}}"]
	replacements["{{.- in gg u}}"] = replacements["{{.Minggu}}"]
	replacements["{{. Minggu}}"] = replacements["{{.Minggu}}"]

	if _, exists := replacements["{{.Indikator}}"]; !exists {
		replacements["{{.Indikator}}"] = "-"
	}
	if _, exists := replacements["{{.Materi}}"]; !exists {
		replacements["{{.Materi}}"] = "-"
	}
	if _, exists := replacements["{{.Metode}}"]; !exists {
		replacements["{{.Metode}}"] = "-"
	}
	if _, exists := replacements["{{.Waktu}}"]; !exists {
		replacements["{{.Waktu}}"] = "-"
	}
	// Broken Waktu variants
	replacements["{{.Wa ktu}}"] = replacements["{{.Waktu}}"]
	replacements["{{.W aktu}}"] = replacements["{{.Waktu}}"]
	replacements["{{.Wak tu}}"] = replacements["{{.Waktu}}"]
	replacements["{{.Wakt u}}"] = replacements["{{.Waktu}}"]
	replacements["{{. Waktu}}"] = replacements["{{.Waktu}}"]

	if _, exists := replacements["{{.Penilaian}}"]; !exists {
		replacements["{{.Penilaian}}"] = "-"
	}
	if _, exists := replacements["{{.Bobot}}"]; !exists {
		replacements["{{.Bobot}}"] = "-"
	}
	// Broken Bobot variants
	replacements["{{.Bob ot}}"] = replacements["{{.Bobot}}"]
	replacements["{{.Bo bot}}"] = replacements["{{.Bobot}}"]
	replacements["{{.Bobo t}}"] = replacements["{{.Bobot}}"]
	replacements["{{. Bobot}}"] = replacements["{{.Bobot}}"]

	// Default empty values for missing placeholders
	for key := range replacements {
		if replacements[key] == "" {
			replacements[key] = "-"
		}
	}

	return replacements
}

// fixBrokenPlaceholders fixes placeholders that Word split across multiple text runs
// Uses a safe approach that ONLY removes w:t, w:r tags - never table structure (w:tc, w:tr)
func fixBrokenPlaceholders(content string, replacements map[string]string) string {
	// NO REGEX - only direct string replacement to avoid XML corruption
	// Simply replace all known placeholders with their values
	for placeholder, value := range replacements {
		escapedValue := escapeXML(value)
		content = strings.ReplaceAll(content, placeholder, escapedValue)
	}

	return content
}

func escapeXML(s string) string {
	s = strings.ReplaceAll(s, "&", "&amp;")
	s = strings.ReplaceAll(s, "<", "&lt;")
	s = strings.ReplaceAll(s, ">", "&gt;")
	s = strings.ReplaceAll(s, "\"", "&quot;")
	s = strings.ReplaceAll(s, "'", "&apos;")

	// Convert newlines to Word XML line breaks
	s = strings.ReplaceAll(s, "\n", "</w:t><w:br/><w:t>")

	return s
}
