package controllers

import (
	"archive/zip"
	"bytes"
	"encoding/json"
	"encoding/xml"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"time"

	"smart-rps-backend/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// ExportWithTableDuplication - Export RPS dengan duplikasi tabel tugas otomatis
func (gc *GeneratedRPSController) ExportWithTableDuplication(c *gin.Context) {
	id := c.Param("id")
	rpsID, err := uuid.Parse(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid RPS ID"})
		return
	}

	// Load RPS with relations
	var rps models.GeneratedRPS
	if err := gc.db.Preload("Course").
		Preload("Course.Program").
		First(&rps, rpsID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "RPS not found"})
		return
	}

	// Load dosens
	var dosens []models.Dosen
	gc.db.Preload("Prodi").
		Preload("User").
		Find(&dosens)

	// Parse RPS data
	var result map[string]interface{}
	if err := json.Unmarshal([]byte(rps.Result), &result); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse RPS data"})
		return
	}

	// Get template path
	templatePath := filepath.Join("templates", "template_rps.docx")
	if _, err := os.Stat(templatePath); os.IsNotExist(err) {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Template not found"})
		return
	}

	// Process document with table duplication
	outputBuffer, err := processDocxWithTableDuplication(templatePath, &rps, dosens, result)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to process document: %v", err)})
		return
	}

	// Return file
	filename := fmt.Sprintf("RPS_%s_%s.docx", rps.Course.Code, time.Now().Format("20060102"))
	c.Header("Content-Description", "File Transfer")
	c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=%s", filename))
	c.Data(http.StatusOK, "application/vnd.openxmlformats-officedocument.wordprocessingml.document", outputBuffer.Bytes())
}

func processDocxWithTableDuplication(templatePath string, rps *models.GeneratedRPS, dosens []models.Dosen, result map[string]interface{}) (*bytes.Buffer, error) {
	// Read template file
	templateData, err := os.ReadFile(templatePath)
	if err != nil {
		return nil, fmt.Errorf("failed to read template: %v", err)
	}

	// Open template as ZIP
	zipReader, err := zip.NewReader(bytes.NewReader(templateData), int64(len(templateData)))
	if err != nil {
		return nil, fmt.Errorf("failed to open template as zip: %v", err)
	}

	// Create output buffer
	outputBuffer := new(bytes.Buffer)
	zipWriter := zip.NewWriter(outputBuffer)
	defer zipWriter.Close()

	// Find and process document.xml
	var documentXML []byte
	for _, file := range zipReader.File {
		if file.Name == "word/document.xml" {
			// Read document.xml
			rc, err := file.Open()
			if err != nil {
				return nil, fmt.Errorf("failed to open document.xml: %v", err)
			}
			documentXML, err = io.ReadAll(rc)
			rc.Close()
			if err != nil {
				return nil, fmt.Errorf("failed to read document.xml: %v", err)
			}

			// Process XML with table duplication
			processedXML, err := duplicateTablesInXML(string(documentXML), rps, dosens, result)
			if err != nil {
				return nil, fmt.Errorf("failed to process XML: %v", err)
			}

			// Write processed document.xml
			w, err := zipWriter.Create(file.Name)
			if err != nil {
				return nil, err
			}
			_, err = w.Write([]byte(processedXML))
			if err != nil {
				return nil, err
			}
		} else {
			// Copy other files as-is
			w, err := zipWriter.Create(file.Name)
			if err != nil {
				return nil, err
			}
			rc, err := file.Open()
			if err != nil {
				return nil, err
			}
			_, err = io.Copy(w, rc)
			rc.Close()
			if err != nil {
				return nil, err
			}
		}
	}

	return outputBuffer, nil
}

func duplicateTablesInXML(xmlContent string, rps *models.GeneratedRPS, dosens []models.Dosen, result map[string]interface{}) (string, error) {
	// Get tugas data
	tugasData, ok := result["tugas"].([]interface{})
	if !ok {
		tugasData = []interface{}{} // Empty array if no tugas
	}

	numTugas := len(tugasData)
	fmt.Printf("Found %d tugas items\n", numTugas)

	// Replace placeholders for existing tugas (1 to N)
	resultXML := xmlContent
	for i := 0; i < numTugas && i < 20; i++ {
		if tugas, ok := tugasData[i].(map[string]interface{}); ok {
			resultXML = replacePlaceholders(resultXML, rps, dosens, result, i+1, tugas)
		}
	}

	// Remove unused tables (from N+1 to 20)
	// Find and delete tables containing placeholder for unused tugas numbers
	for i := numTugas + 1; i <= 20; i++ {
		// Pattern to match table containing specific tugas placeholder
		pattern := fmt.Sprintf(`(?s)<w:tbl>.*?\{[^}]*TUGAS[^}]*_%d\}.*?</w:tbl>`, i)
		tablePattern := regexp.MustCompile(pattern)

		// Remove all occurrences of tables with this tugas number
		resultXML = tablePattern.ReplaceAllString(resultXML, "")

		// Also try pattern without underscore (e.g., {JUDUL_TUGAS} {NO_TUGAS} where NO_TUGAS = i)
		// This is less precise, so we do it carefully
	}

	// Replace remaining basic placeholders (non-tugas)
	resultXML = replacePlaceholders(resultXML, rps, dosens, result, 0, nil)

	return resultXML, nil
}

func replacePlaceholders(content string, rps *models.GeneratedRPS, dosens []models.Dosen, result map[string]interface{}, tugasIndex int, tugas map[string]interface{}) string {
	replaceMap := make(map[string]string)

	// Basic info
	replaceMap["{NAMA_MK}"] = rps.Course.Title
	replaceMap["{KODE_MK}"] = rps.Course.Code

	if rps.Course.Credits != nil {
		replaceMap["{SKS}"] = fmt.Sprintf("%d", *rps.Course.Credits)
	}
	if rps.Course.Semester != nil {
		replaceMap["{SEMESTER}"] = fmt.Sprintf("%d", *rps.Course.Semester)
	}

	// Dosen
	if len(dosens) > 0 {
		replaceMap["{DOSEN}"] = dosens[0].NamaLengkap
	}

	// MK Prasyarat
	mkPrasyarat := "-"
	if rps.Course.Program != nil && rps.Course.Program.Name != "" {
		mkPrasyarat = "Tidak ada"
	}
	replaceMap["{MK_PRASYARAT}"] = mkPrasyarat

	// If tugasIndex > 0, replace tugas-specific placeholders
	if tugasIndex > 0 && tugas != nil {
		suffix := fmt.Sprintf("_%d", tugasIndex)

		replaceMap["{NO_TUGAS}"] = fmt.Sprintf("%d", tugasIndex)
		replaceMap["{SUB_CPMK_TUGAS}"+suffix] = getStringValue(tugas, "sub_cpmk")
		replaceMap["{INDIKATOR_TUGAS}"+suffix] = getStringValue(tugas, "indikator")
		replaceMap["{JUDUL_TUGAS}"+suffix] = getStringValue(tugas, "judul_tugas")
		replaceMap["{BATAS_TUGAS}"+suffix] = getStringValue(tugas, "batas_waktu")
		replaceMap["{PETUNJUK_TUGAS}"+suffix] = getStringValue(tugas, "petunjuk_pengerjaan")
		replaceMap["{LUARAN_TUGAS}"+suffix] = getStringValue(tugas, "luaran_tugas")
		replaceMap["{KRITERIA_TUGAS}"+suffix] = getStringValue(tugas, "kriteria")
		replaceMap["{TEKNIK_PENILAIAN_TUGAS}"+suffix] = getStringValue(tugas, "teknik_penilaian")
		replaceMap["{BOBOT_TUGAS}"+suffix] = fmt.Sprintf("%v", tugas["bobot"])

		// Also replace without suffix for template compatibility
		replaceMap["{SUB_CPMK_TUGAS}"] = getStringValue(tugas, "sub_cpmk")
		replaceMap["{INDIKATOR_TUGAS}"] = getStringValue(tugas, "indikator")
		replaceMap["{JUDUL_TUGAS}"] = getStringValue(tugas, "judul_tugas")
		replaceMap["{BATAS_TUGAS}"] = getStringValue(tugas, "batas_waktu")
		replaceMap["{PETUNJUK_TUGAS}"] = getStringValue(tugas, "petunjuk_pengerjaan")
		replaceMap["{LUARAN_TUGAS}"] = getStringValue(tugas, "luaran_tugas")
		replaceMap["{KRITERIA_TUGAS}"] = getStringValue(tugas, "kriteria")
		replaceMap["{TEKNIK_PENILAIAN_TUGAS}"] = getStringValue(tugas, "teknik_penilaian")
		replaceMap["{BOBOT_TUGAS}"] = fmt.Sprintf("%v", tugas["bobot"])

		// Daftar rujukan
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
		replaceMap["{DAFTAR_RUJUKAN}"+suffix] = rujukanText
		replaceMap["{DAFTAR_RUJUKAN}"] = rujukanText
	}

	// Replace all placeholders - escape XML pada saat replace
	resultStr := content
	for placeholder, value := range replaceMap {
		resultStr = strings.ReplaceAll(resultStr, placeholder, xmlEscape(value))
	}

	return resultStr
}

func xmlEscape(s string) string {
	// XML escape for Word document
	s = strings.ReplaceAll(s, "&", "&amp;")
	s = strings.ReplaceAll(s, "<", "&lt;")
	s = strings.ReplaceAll(s, ">", "&gt;")
	s = strings.ReplaceAll(s, "\"", "&quot;")

	// Convert newlines to Word line breaks
	s = strings.ReplaceAll(s, "\n", "<w:br/>")

	return s
}

// Node represents XML node
type Node struct {
	XMLName xml.Name
	Attrs   []xml.Attr `xml:",any,attr"`
	Content []byte     `xml:",innerxml"`
	Nodes   []Node     `xml:",any"`
}
