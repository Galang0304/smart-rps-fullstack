package controllers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
)

type AIController struct{}

func NewAIController() *AIController {
	return &AIController{}
}

// HealthCheck - Check AI service status
func (ac *AIController) HealthCheck(c *gin.Context) {
	apiKey := os.Getenv("OPENAI_API_KEY")
	if apiKey == "" {
		c.JSON(http.StatusServiceUnavailable, gin.H{
			"status":  "unavailable",
			"message": "OpenAI API key not configured",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "available",
		"message": "AI service is ready",
		"model":   "gpt-4o-mini",
	})
}

// GetTypes - Get available AI generation types
func (ac *AIController) GetTypes(c *gin.Context) {
	types := []gin.H{
		{"id": "cpmk", "name": "CPMK", "description": "Generate Capaian Pembelajaran Mata Kuliah"},
		{"id": "sub-cpmk", "name": "Sub-CPMK", "description": "Generate Sub Capaian Pembelajaran"},
		{"id": "topik", "name": "Topik", "description": "Generate Topik Pembelajaran per Minggu"},
		{"id": "referensi", "name": "Referensi", "description": "Generate Daftar Referensi"},
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    types,
	})
}

// GenerateCPMK - Generate CPMK using Gemini
func (ac *AIController) GenerateCPMK(c *gin.Context) {
	var req struct {
		CourseTitle string `json:"course_title" binding:"required"`
		CourseCode  string `json:"course_code" binding:"required"`
		Credits     int    `json:"credits"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		fmt.Printf("[AI] Bind error: %v\n", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	fmt.Printf("[AI] Generating CPMK for: %s (%s) - %d SKS\n", req.CourseTitle, req.CourseCode, req.Credits)

	prompt := fmt.Sprintf(`Buatkan 3-5 CPMK (Capaian Pembelajaran Mata Kuliah) untuk mata kuliah:
Nama: %s
Kode: %s
SKS: %d

Format output dalam JSON array dengan struktur:
[
  {"code": "CPMK-1", "description": "deskripsi capaian pembelajaran"},
  {"code": "CPMK-2", "description": "deskripsi capaian pembelajaran"}
]

Pastikan CPMK menggunakan Taksonomi Bloom yang sesuai dengan level mata kuliah.
HANYA kembalikan JSON array, tanpa penjelasan tambahan.`, req.CourseTitle, req.CourseCode, req.Credits)

	result, err := ac.callOpenAI(prompt)
	if err != nil {
		fmt.Printf("[AI] OpenAI error: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate CPMK: " + err.Error()})
		return
	}

	fmt.Printf("[AI] OpenAI response received, length: %d\n", len(result))

	// Parse JSON response from Gemini
	var items []map[string]interface{}
	// Remove markdown code blocks if present
	cleanResult := strings.TrimSpace(result)
	cleanResult = strings.TrimPrefix(cleanResult, "```json")
	cleanResult = strings.TrimPrefix(cleanResult, "```")
	cleanResult = strings.TrimSuffix(cleanResult, "```")
	cleanResult = strings.TrimSpace(cleanResult)

	if err := json.Unmarshal([]byte(cleanResult), &items); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":        "Failed to parse AI response: " + err.Error(),
			"raw_response": result,
			"cleaned":      cleanResult,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"items": items,
		},
	})
}

// GenerateSubCPMK - Generate Sub-CPMK using Gemini
func (ac *AIController) GenerateSubCPMK(c *gin.Context) {
	var req struct {
		CPMK        string `json:"cpmk" binding:"required"`
		CourseTitle string `json:"course_title" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	prompt := fmt.Sprintf(`Buatkan 3-5 Sub-CPMK (Sub Capaian Pembelajaran) untuk CPMK berikut:
CPMK: %s
Mata Kuliah: %s

Format output dalam JSON array dengan struktur:
[
  {"code": "Sub-CPMK-1", "description": "deskripsi sub capaian", "cpmk_id": "CPMK-1"},
  {"code": "Sub-CPMK-2", "description": "deskripsi sub capaian", "cpmk_id": "CPMK-1"}
]

Pastikan Sub-CPMK lebih spesifik dan terukur dibanding CPMK induknya.
HANYA kembalikan JSON array, tanpa penjelasan tambahan.`, req.CPMK, req.CourseTitle)

	result, err := ac.callOpenAI(prompt)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate Sub-CPMK: " + err.Error()})
		return
	}

	// Parse JSON response
	var items []map[string]interface{}
	cleanResult := strings.TrimSpace(result)
	cleanResult = strings.TrimPrefix(cleanResult, "```json")
	cleanResult = strings.TrimPrefix(cleanResult, "```")
	cleanResult = strings.TrimSuffix(cleanResult, "```")
	cleanResult = strings.TrimSpace(cleanResult)

	if err := json.Unmarshal([]byte(cleanResult), &items); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse AI response: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"items": items,
		},
	})
}

// GenerateTopik - Generate learning topics using Gemini
func (ac *AIController) GenerateTopik(c *gin.Context) {
	var req struct {
		CourseCode  string `json:"course_code"`
		CourseTitle string `json:"course_title" binding:"required"`
		CPMK        string `json:"cpmk"`
		SubCPMK     string `json:"sub_cpmk"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	weeks := 16

	prompt := fmt.Sprintf(`Buatkan %d topik pembelajaran untuk mata kuliah "%s" (%s).

CPMK yang harus dicapai:
%s

Sub-CPMK:
%s

Format output dalam JSON array dengan struktur:
[
  {"topic": "judul topik", "description": "deskripsi pembelajaran minggu ini"},
  {"topic": "judul topik", "description": "deskripsi pembelajaran minggu ini"}
]

Buatkan topik untuk 16 minggu yang tersusun secara progresif dari dasar ke kompleks.
HANYA kembalikan JSON array, tanpa penjelasan tambahan.`, weeks, req.CourseTitle, req.CourseCode, req.CPMK, req.SubCPMK)

	result, err := ac.callOpenAI(prompt)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate Topik: " + err.Error()})
		return
	}

	// Parse JSON response
	var items []map[string]interface{}
	cleanResult := strings.TrimSpace(result)
	cleanResult = strings.TrimPrefix(cleanResult, "```json")
	cleanResult = strings.TrimPrefix(cleanResult, "```")
	cleanResult = strings.TrimSuffix(cleanResult, "```")
	cleanResult = strings.TrimSpace(cleanResult)

	if err := json.Unmarshal([]byte(cleanResult), &items); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse AI response: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"items": items,
		},
	})
}

// GenerateReferensi - Generate references using Gemini
func (ac *AIController) GenerateReferensi(c *gin.Context) {
	var req struct {
		CourseTitle string   `json:"course_title" binding:"required"`
		Topics      []string `json:"topics"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	prompt := fmt.Sprintf(`Buatkan 8-10 referensi buku dan jurnal untuk mata kuliah "%s".

Topik yang diajarkan:
%v

Format output dalam JSON array dengan struktur:
[
  {"title": "judul buku/jurnal", "author": "nama penulis", "year": 2023, "publisher": "penerbit", "type": "book/journal"},
  {"title": "judul buku/jurnal", "author": "nama penulis", "year": 2022, "publisher": "penerbit", "type": "book/journal"}
]

Prioritaskan referensi terbaru (2020-2024) dan yang relevan dengan topik.
HANYA kembalikan JSON array, tanpa penjelasan tambahan.`, req.CourseTitle, req.Topics)

	result, err := ac.callOpenAI(prompt)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate Referensi: " + err.Error()})
		return
	}

	// Parse JSON response
	var items []map[string]interface{}
	cleanResult := strings.TrimSpace(result)
	cleanResult = strings.TrimPrefix(cleanResult, "```json")
	cleanResult = strings.TrimPrefix(cleanResult, "```")
	cleanResult = strings.TrimSuffix(cleanResult, "```")
	cleanResult = strings.TrimSpace(cleanResult)

	if err := json.Unmarshal([]byte(cleanResult), &items); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse AI response: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"items": items,
		},
	})
}

// GenerateTugas - Generate assignment details using Gemini
func (ac *AIController) GenerateTugas(c *gin.Context) {
	var req struct {
		CourseCode     string `json:"course_code"`
		CourseTitle    string `json:"course_title" binding:"required"`
		TugasNumber    int    `json:"tugas_number"`
		CPMKContext    string `json:"cpmk_context"`
		SubCPMKContext string `json:"sub_cpmk_context"`
		TopikContext   string `json:"topik_context"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	prompt := fmt.Sprintf(`Buatkan detail untuk Tugas %d mata kuliah "%s" (%s).

Context CPMK:
%s

Context Sub-CPMK:
%s

Context Topik Pembelajaran:
%s

Buatkan dalam format JSON dengan struktur:
{
  "sub_cpmk": "pilih 1-2 Sub-CPMK yang relevan",
  "indikator": "indikator penilaian yang jelas dan terukur",
  "judul_tugas": "judul tugas yang menarik dan sesuai topik",
  "batas_waktu": "estimasi waktu pengerjaan (contoh: Minggu ke-5)",
  "petunjuk_pengerjaan": "petunjuk detail dan jelas untuk mahasiswa",
  "luaran_tugas": "output yang diharapkan dari tugas ini",
  "kriteria": "kriteria penilaian yang objektif",
  "teknik_penilaian": "metode penilaian yang digunakan",
  "bobot": 20,
  "daftar_rujukan": ["Referensi 1", "Referensi 2"]
}

HANYA kembalikan JSON object, tanpa penjelasan tambahan.`, req.TugasNumber, req.CourseTitle, req.CourseCode, req.CPMKContext, req.SubCPMKContext, req.TopikContext)

	result, err := ac.callOpenAI(prompt)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate Tugas: " + err.Error()})
		return
	}

	// Parse JSON response
	var tugasData map[string]interface{}
	cleanResult := strings.TrimSpace(result)
	cleanResult = strings.TrimPrefix(cleanResult, "```json")
	cleanResult = strings.TrimPrefix(cleanResult, "```")
	cleanResult = strings.TrimSuffix(cleanResult, "```")
	cleanResult = strings.TrimSpace(cleanResult)

	if err := json.Unmarshal([]byte(cleanResult), &tugasData); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse AI response: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    tugasData,
	})
}

// callOpenAI - Helper function to call OpenAI API
func (ac *AIController) callOpenAI(prompt string) (string, error) {
	apiKey := os.Getenv("OPENAI_API_KEY")
	if apiKey == "" {
		return "", fmt.Errorf("OPENAI_API_KEY not configured")
	}

	url := "https://api.openai.com/v1/chat/completions"

	requestBody := map[string]interface{}{
		"model": "gpt-4o-mini",
		"messages": []map[string]string{
			{"role": "user", "content": prompt},
		},
		"temperature": 0.7,
		"max_tokens":  2048,
		"top_p":       0.95,
	}

	jsonData, err := json.Marshal(requestBody)
	if err != nil {
		return "", err
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		return "", err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+apiKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	if resp.StatusCode != http.StatusOK {
		// Parse error response for better error messages
		var errorResp struct {
			Error struct {
				Code    string `json:"code"`
				Message string `json:"message"`
				Type    string `json:"type"`
			} `json:"error"`
		}

		if err := json.Unmarshal(body, &errorResp); err == nil {
			if errorResp.Error.Code == "insufficient_quota" || errorResp.Error.Type == "insufficient_quota" {
				return "", fmt.Errorf("quota OpenAI API habis, silakan top up atau gunakan API key baru")
			}
			return "", fmt.Errorf("OpenAI API error: %s", errorResp.Error.Message)
		}
		return "", fmt.Errorf("OpenAI API error: %s", string(body))
	}

	// Parse OpenAI response
	var openaiResp struct {
		Choices []struct {
			Message struct {
				Content string `json:"content"`
			} `json:"message"`
		} `json:"choices"`
	}

	if err := json.Unmarshal(body, &openaiResp); err != nil {
		return "", err
	}

	if len(openaiResp.Choices) == 0 {
		return "", fmt.Errorf("no response from OpenAI")
	}

	return openaiResp.Choices[0].Message.Content, nil
}
