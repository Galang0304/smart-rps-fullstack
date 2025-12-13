package controllers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"smart-rps-backend/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/unidoc/unioffice/color"
	"github.com/unidoc/unioffice/document"
	"github.com/unidoc/unioffice/schema/soo/wml"
)

// ExportDynamic - Export RPS dengan tabel tugas yang dinamis
func (gc *GeneratedRPSController) ExportDynamic(c *gin.Context) {
	id := c.Param("id")
	rpsID, err := uuid.Parse(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid RPS ID"})
		return
	}

	// Load RPS with all relations
	var rps models.GeneratedRPS
	if err := gc.db.Preload("Course").
		Preload("Course.Program").
		Preload("Course.Program.Prodi").
		First(&rps, rpsID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "RPS not found"})
		return
	}

	// Load dosens
	var dosens []models.Dosen
	gc.db.Table("dosen_courses").
		Select("dosens.*").
		Joins("JOIN dosens ON dosens.id = dosen_courses.dosen_id").
		Where("dosen_courses.course_id = ?", rps.CourseID).
		Preload("Prodi").
		Find(&dosens)

	// Parse RPS data
	var result map[string]interface{}
	if err := json.Unmarshal([]byte(rps.RPSData), &result); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse RPS data"})
		return
	}

	// Create new document
	doc := document.New()

	// Add title
	addTitle(doc, "RENCANA PEMBELAJARAN SEMESTER (RPS)")

	// Add basic info table
	addBasicInfoTable(doc, &rps, dosens)

	// Add CPMK section
	if cpmkData, ok := result["cpmk"].([]interface{}); ok {
		addCPMKSection(doc, cpmkData)
	}

	// Add Sub-CPMK section
	if subCpmkData, ok := result["sub_cpmk"].([]interface{}); ok {
		addSubCPMKSection(doc, subCpmkData)
	}

	// Add Rencana Pembelajaran table
	if topikData, ok := result["topik"].([]interface{}); ok {
		addRencanaPembelajaranTable(doc, topikData)
	}

	// Add dynamic Rencana Tugas tables
	if tugasData, ok := result["tugas"].([]interface{}); ok {
		addDynamicTugasTables(doc, tugasData, &rps, dosens)
	}

	// Write to buffer
	var buf bytes.Buffer
	if err := doc.Save(&buf); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save document"})
		return
	}

	// Set headers and return file
	filename := fmt.Sprintf("RPS_%s_%s.docx", rps.Course.Code, time.Now().Format("20060102"))
	c.Header("Content-Description", "File Transfer")
	c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=%s", filename))
	c.Data(http.StatusOK, "application/vnd.openxmlformats-officedocument.wordprocessingml.document", buf.Bytes())
}

// Helper functions

func addTitle(doc *document.Document, title string) {
	para := doc.AddParagraph()
	para.Properties().SetAlignment(wml.ST_JcCenter)
	run := para.AddRun()
	run.AddText(title)
	run.Properties().SetBold(true)
	run.Properties().SetSize(16)
}

func addBasicInfoTable(doc *document.Document, rps *models.GeneratedRPS, dosens []models.Dosen) {
	doc.AddParagraph() // Space

	table := doc.AddTable()
	table.Properties().SetWidthPercent(100)

	// Row 1: Perguruan Tinggi
	addTableRow(table, "PERGURUAN TINGGI", "Universitas Muhammadiyah Makassar")

	// Row 2: Fakultas
	fakultas := ""
	if len(dosens) > 0 && dosens[0].Prodi != nil {
		fakultas = dosens[0].Prodi.Fakultas
	}
	addTableRow(table, "FAKULTAS", fakultas)

	// Row 3: Program Studi
	prodi := ""
	if rps.Course.Program != nil {
		prodi = rps.Course.Program.Name
	}
	addTableRow(table, "PROGRAM STUDI", prodi)

	// Row 4: Nama MK, Kode, SKS, Semester
	row := table.AddRow()
	addCellWithBold(row.AddCell(), "NAMA MATA KULIAH")
	addCellNormal(row.AddCell(), rps.Course.Title)
	addCellWithBold(row.AddCell(), "KODE MK")
	addCellNormal(row.AddCell(), rps.Course.Code)

	// Row 5: SKS dan Semester
	row2 := table.AddRow()
	addCellWithBold(row2.AddCell(), "BOBOT (SKS)")
	addCellNormal(row2.AddCell(), fmt.Sprintf("%d", *rps.Course.Credits))
	addCellWithBold(row2.AddCell(), "SEMESTER")
	addCellNormal(row2.AddCell(), fmt.Sprintf("%d", *rps.Course.Semester))
}

func addCPMKSection(doc *document.Document, cpmkData []interface{}) {
	doc.AddParagraph().AddRun().AddText("CAPAIAN PEMBELAJARAN MATA KULIAH (CPMK)")

	table := doc.AddTable()
	table.Properties().SetWidthPercent(100)

	// Header
	header := table.AddRow()
	addCellWithBold(header.AddCell(), "Kode")
	addCellWithBold(header.AddCell(), "Deskripsi")

	// Data rows
	for _, item := range cpmkData {
		if cpmk, ok := item.(map[string]interface{}); ok {
			row := table.AddRow()
			addCellNormal(row.AddCell(), getString(cpmk, "code"))
			addCellNormal(row.AddCell(), getString(cpmk, "description"))
		}
	}
}

func addSubCPMKSection(doc *document.Document, subCpmkData []interface{}) {
	doc.AddParagraph().AddRun().AddText("SUB-CAPAIAN PEMBELAJARAN MATA KULIAH (Sub-CPMK)")

	table := doc.AddTable()
	table.Properties().SetWidthPercent(100)

	// Header
	header := table.AddRow()
	addCellWithBold(header.AddCell(), "Kode")
	addCellWithBold(header.AddCell(), "Deskripsi")
	addCellWithBold(header.AddCell(), "CPMK")

	// Data rows
	for _, item := range subCpmkData {
		if subCpmk, ok := item.(map[string]interface{}); ok {
			row := table.AddRow()
			addCellNormal(row.AddCell(), getString(subCpmk, "code"))
			addCellNormal(row.AddCell(), getString(subCpmk, "description"))
			addCellNormal(row.AddCell(), getString(subCpmk, "cpmk_id"))
		}
	}
}

func addRencanaPembelajaranTable(doc *document.Document, topikData []interface{}) {
	doc.AddParagraph()
	para := doc.AddParagraph()
	para.AddRun().AddText("RENCANA PEMBELAJARAN")

	table := doc.AddTable()
	table.Properties().SetWidthPercent(100)

	// Header
	header := table.AddRow()
	addCellWithBold(header.AddCell(), "Minggu")
	addCellWithBold(header.AddCell(), "Sub-CPMK")
	addCellWithBold(header.AddCell(), "Indikator")
	addCellWithBold(header.AddCell(), "Topik")
	addCellWithBold(header.AddCell(), "Metode")
	addCellWithBold(header.AddCell(), "Waktu")
	addCellWithBold(header.AddCell(), "Kriteria")
	addCellWithBold(header.AddCell(), "Bobot")

	// Data rows
	for _, item := range topikData {
		if topik, ok := item.(map[string]interface{}); ok {
			row := table.AddRow()
			addCellNormal(row.AddCell(), fmt.Sprintf("%v", topik["week"]))
			addCellNormal(row.AddCell(), getString(topik, "topic"))
			addCellNormal(row.AddCell(), getString(topik, "description"))
			addCellNormal(row.AddCell(), getString(topik, "topic"))
			addCellNormal(row.AddCell(), "Ceramah, Diskusi")
			addCellNormal(row.AddCell(), "150")
			addCellNormal(row.AddCell(), "Kehadiran, Partisipasi")
			addCellNormal(row.AddCell(), "5%")
		}
	}
}

func addDynamicTugasTables(doc *document.Document, tugasData []interface{}, rps *models.GeneratedRPS, dosens []models.Dosen) {
	namaDosen := ""
	if len(dosens) > 0 {
		namaDosen = dosens[0].NamaLengkap
	}

	// Add page break before tugas section
	doc.AddParagraph()

	for i, item := range tugasData {
		if tugas, ok := item.(map[string]interface{}); ok {
			// Add title for each tugas
			doc.AddParagraph()
			titlePara := doc.AddParagraph()
			titleRun := titlePara.AddRun()
			titleRun.AddText(fmt.Sprintf("RENCANA TUGAS %d", i+1))
			titleRun.Properties().SetBold(true)
			titleRun.Properties().SetSize(14)

			// Create table for this tugas
			table := doc.AddTable()
			table.Properties().SetWidthPercent(100)

			// Header row with logo and title
			headerRow := table.AddRow()
			logoCell := headerRow.AddCell()
			addCellNormal(logoCell, "[LOGO]")

			titleCell := headerRow.AddCell()
			titleCell.Properties().SetColumnSpan(3)
			titlePara := titleCell.AddParagraph()
			titlePara.Properties().SetAlignment(wml.ST_JcCenter)
			titlePara.AddRun().AddText("PERGURUAN TINGGI")
			titlePara.AddRun().AddBreak()
			titlePara.AddRun().AddText("FAKULTAS")
			titlePara.AddRun().AddBreak()
			run := titlePara.AddRun()
			run.AddText("PROGRAM STUDI")
			run.Properties().SetBold(true)
			titlePara.AddRun().AddBreak()
			titlePara.AddRun().AddText("RENCANA TUGAS MAHASISWA")

			// Identitas Mata Kuliah section
			addTugasHeaderRow(table, "Identitas Mata Kuliah")
			addTugasDataRow(table, "Nama MK", rps.Course.Title)
			addTugasDataRow(table, "Kode", rps.Course.Code)
			addTugasDataRow(table, "Semester", fmt.Sprintf("%d", *rps.Course.Semester))
			addTugasDataRow(table, "SKS", fmt.Sprintf("%d", *rps.Course.Credits))

			// Sub-CPMK & Indikator section
			addTugasHeaderRow(table, "Sub-CPMK & Indikator")
			addTugasDataRow(table, "Sub-CPMK", getString(tugas, "sub_cpmk"))
			addTugasDataRow(table, "Indikator", getString(tugas, "indikator"))

			// Rencana Tugas section
			addTugasHeaderRow(table, "Rencana Tugas")
			addTugasDataRow(table, "Judul Tugas", getString(tugas, "judul_tugas"))
			addTugasDataRow(table, "Batas Waktu", getString(tugas, "batas_waktu"))
			addTugasDataRow(table, "Petunjuk Pengerjaan Tugas", getString(tugas, "petunjuk_pengerjaan"))
			addTugasDataRow(table, "Luaran Tugas", getString(tugas, "luaran_tugas"))

			// Penilaian section
			addTugasHeaderRow(table, "Penilaian")
			addTugasDataRow(table, "Kriteria", getString(tugas, "kriteria"))
			addTugasDataRow(table, "Teknik Penilaian", getString(tugas, "teknik_penilaian"))
			addTugasDataRow(table, "Bobot (%)", fmt.Sprintf("%v", tugas["bobot"]))

			// Daftar Rujukan section
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
			addTugasHeaderRow(table, "Daftar Rujukan")
			addTugasDataRow(table, "", rujukanText)

			// Add space between tugas
			doc.AddParagraph()
		}
	}
}

func addTugasHeaderRow(table document.Table, header string) {
	row := table.AddRow()
	cell := row.AddCell()
	cell.Properties().SetColumnSpan(2)
	cell.Properties().SetShading(wml.ST_ShdSolid, color.Auto, color.RGB(0, 176, 240))
	para := cell.AddParagraph()
	run := para.AddRun()
	run.AddText(header)
	run.Properties().SetBold(true)
	run.Properties().SetColor(color.White)
}

func addTugasDataRow(table document.Table, label string, value string) {
	row := table.AddRow()
	labelCell := row.AddCell()
	labelCell.Properties().SetWidthAuto()
	addCellWithBold(labelCell, label)

	valueCell := row.AddCell()
	addCellNormal(valueCell, value)
}

func addTableRow(table document.Table, label string, value string) {
	row := table.AddRow()
	addCellWithBold(row.AddCell(), label)
	addCellNormal(row.AddCell(), value)
}

func addCellWithBold(cell document.Cell, text string) {
	para := cell.AddParagraph()
	run := para.AddRun()
	run.AddText(text)
	run.Properties().SetBold(true)
}

func addCellNormal(cell document.Cell, text string) {
	para := cell.AddParagraph()
	para.AddRun().AddText(text)
}

func getString(m map[string]interface{}, key string) string {
	if val, ok := m[key]; ok {
		if str, ok := val.(string); ok {
			return str
		}
		return fmt.Sprintf("%v", val)
	}
	return ""
}
