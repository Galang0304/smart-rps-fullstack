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
	c.Header("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
	c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=\"%s\"", filename))
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
	defer outFile.Close()

	// Create zip writer
	zipWriter := zip.NewWriter(outFile)
	defer zipWriter.Close()

	// Process each file in the zip
	for _, file := range reader.File {
		if err := processZipFile(file, zipWriter, replacements); err != nil {
			return err
		}
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

	// Basic course info - Support both formats: {{FIELD}} and {{.Field}}
	replacements["{{NAMA_MK}}"] = rps.Course.Title
	replacements["{{.NamaMataKuliah}}"] = rps.Course.Title
	replacements["{{NamaMataKuliah}}"] = rps.Course.Title

	replacements["{{KODE_MK}}"] = rps.Course.Code
	replacements["{{.Kode MK}}"] = rps.Course.Code
	replacements["{{.KodeMK}}"] = rps.Course.Code
	replacements["{{Kode MK}}"] = rps.Course.Code

	replacements["{{RUMPUN_MK}}"] = "Teknik Informatika"
	replacements["{{.RumpunMK}}"] = "Teknik Informatika"
	replacements["{{.RumpunM K}}"] = "Teknik Informatika"
	replacements["{{RumpunMK}}"] = "Teknik Informatika"

	if rps.Course.Credits != nil {
		sks := strconv.Itoa(*rps.Course.Credits)
		replacements["{{SKS}}"] = sks
		replacements["{{.BobotSKS}}"] = sks
		replacements["{{.Bobot(SKS)}}"] = sks
		replacements["{{Bobot(SKS)}}"] = sks
		replacements["{{BobotSKS}}"] = sks
		replacements["{{BOBOT}}"] = sks
	} else {
		replacements["{{SKS}}"] = "0"
		replacements["{{.BobotSKS}}"] = "0"
		replacements["{{.Bobot(SKS)}}"] = "0"
		replacements["{{Bobot(SKS)}}"] = "0"
		replacements["{{BobotSKS}}"] = "0"
		replacements["{{BOBOT}}"] = "0"
	}

	if rps.Course.Semester != nil {
		sem := strconv.Itoa(*rps.Course.Semester)
		replacements["{{SEMESTER}}"] = sem
		replacements["{{.Semester}}"] = sem
		replacements["{{Semester}}"] = sem
	} else {
		replacements["{{SEMESTER}}"] = "-"
		replacements["{{.Semester}}"] = "-"
		replacements["{{Semester}}"] = "-"
	}

	// TGL Penyusunan (tanggal sekarang)
	currentDate := time.Now().Format("02 January 2006")
	replacements["{{.TglPenyusunan}}"] = currentDate
	replacements["{{TglPenyusunan}}"] = currentDate
	replacements["{{TGL_PENYUSUNAN}}"] = currentDate

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
	replacements["{{DOSEN}}"] = dosenStr
	replacements["{{.KaProdi}}"] = dosenStr
	replacements["{{KaProd}}"] = dosenStr
	replacements["{{KaProdi}}"] = dosenStr
	replacements["{{.KoordinatorRMK}}"] = dosenStr
	replacements["{{KOORDINATOR RMK}}"] = dosenStr
	replacements["{{KoordinatorRMK}}"] = dosenStr

	// UPM Fakultas & Penyusun
	replacements["{{.UPMFakultas}}"] = dosenStr
	replacements["{{.Nam aPenyus unRPS}}"] = dosenStr
	replacements["{{.NamaPenyusunRPS}}"] = dosenStr
	replacements["{{NAMA_PENYU_SUN_RPS}}"] = dosenStr
	replacements["{{KOORDINATOR_RMK}}"] = dosenStr

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

	// Default values for table fields if not set
	if _, exists := replacements["{{.Minggu}}"]; !exists {
		replacements["{{.Minggu}}"] = "-"
		replacements["{{. M in gg u}}"] = "-"
	}
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
		replacements["{{.Wa ktu}}"] = "-"
	}
	if _, exists := replacements["{{.Penilaian}}"]; !exists {
		replacements["{{.Penilaian}}"] = "-"
	}
	if _, exists := replacements["{{.Bobot}}"]; !exists {
		replacements["{{.Bobot}}"] = "-"
		replacements["{{.Bob ot}}"] = "-"
	}

	// Default empty values for missing placeholders
	for key := range replacements {
		if replacements[key] == "" {
			replacements[key] = "-"
		}
	}

	return replacements
}

// normalizeWordXML normalizes Word XML to handle broken placeholders across runs
func normalizeWordXML(content string) string {
	// Step 1: Merge adjacent text runs to fix broken placeholders
	// Pattern: </w:t></w:r><w:r><w:t> or similar variations
	mergePatterns := []string{
		`</w:t></w:r><w:r><w:t>`,
		`</w:t></w:r><w:r><w:rPr>.*?</w:rPr><w:t>`,
		`</w:t></w:r><w:r[^>]*><w:t>`,
		`</w:t></w:r><w:r[^>]*><w:rPr>.*?</w:rPr><w:t>`,
	}

	for _, pattern := range mergePatterns {
		re := regexp.MustCompile(pattern)
		content = re.ReplaceAllString(content, "")
	}

	// Step 2: Remove empty text runs
	content = regexp.MustCompile(`<w:r[^>]*><w:t></w:t></w:r>`).ReplaceAllString(content, "")
	content = regexp.MustCompile(`<w:r[^>]*><w:rPr>.*?</w:rPr><w:t></w:t></w:r>`).ReplaceAllString(content, "")

	// Step 3: Merge text tags within same run
	content = strings.ReplaceAll(content, "</w:t><w:t>", "")
	content = strings.ReplaceAll(content, `</w:t><w:t xml:space="preserve">`, "")

	// Step 4: Remove proofing errors that split text
	content = regexp.MustCompile(`<w:proofErr[^>]*>`).ReplaceAllString(content, "")
	content = strings.ReplaceAll(content, "</w:proofErr>", "")

	// Step 5: Remove bookmarks that might split placeholders
	content = regexp.MustCompile(`<w:bookmarkStart[^>]*>`).ReplaceAllString(content, "")
	content = regexp.MustCompile(`<w:bookmarkEnd[^>]*>`).ReplaceAllString(content, "")

	return content
}

// fixBrokenPlaceholders aggressively fixes and replaces broken placeholders in Word XML
func fixBrokenPlaceholders(content string, replacements map[string]string) string {
	// Step 1: Normalize XML to merge broken runs
	content = normalizeWordXML(content)

	// Step 2: Extract all text runs and rebuild with placeholders intact
	// This is more aggressive - we'll find text content and merge it
	paragraphPattern := regexp.MustCompile(`<w:p[^>]*>(.*?)</w:p>`)
	paragraphs := paragraphPattern.FindAllStringSubmatch(content, -1)

	for _, match := range paragraphs {
		if len(match) < 2 {
			continue
		}

		originalPara := match[0]
		paraContent := match[1]

		// Extract all text from this paragraph
		textPattern := regexp.MustCompile(`<w:t[^>]*>(.*?)</w:t>`)
		texts := textPattern.FindAllStringSubmatch(paraContent, -1)

		// Concatenate all text
		var fullText string
		for _, t := range texts {
			if len(t) >= 2 {
				fullText += t[1]
			}
		}

		// Check if this contains placeholders and replace
		modifiedText := fullText
		hasPlaceholder := false
		for placeholder, value := range replacements {
			if strings.Contains(modifiedText, placeholder) {
				escapedValue := escapeXML(value)
				modifiedText = strings.ReplaceAll(modifiedText, placeholder, escapedValue)
				hasPlaceholder = true
			}
		}

		// If we replaced something, rebuild the paragraph with clean text
		if hasPlaceholder && modifiedText != fullText {
			// Create a simple run with the replaced text
			newPara := regexp.MustCompile(`<w:p[^>]*>`).FindString(originalPara)
			newPara += `<w:r><w:t>` + modifiedText + `</w:t></w:r></w:p>`
			content = strings.Replace(content, originalPara, newPara, 1)
		}
	}

	// Step 3: Final pass - direct replacement for any remaining intact placeholders
	for placeholder, value := range replacements {
		escapedValue := escapeXML(value)
		content = strings.ReplaceAll(content, placeholder, escapedValue)
	}

	return content
}

// normalizeWordXML normalizes Word XML to handle broken placeholders across runs
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
