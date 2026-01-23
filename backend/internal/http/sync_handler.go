package http

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// Struktur JSON Response yang diharapkan SIM CPL
type SyncResponse struct {
	Data []CourseDTO `json:"data"`
}

type CourseDTO struct {
	Code     string    `json:"code"`
	Title    string    `json:"title"`
	Credits  int       `json:"credits"`
	Semester int       `json:"semester"`
	CPMKs    []CPMKDTO `json:"cpmks"`
}

type CPMKDTO struct {
	CPMKNumber  int          `json:"cpmk_number"`
	Description string       `json:"description"`
	Bobot       float64      `json:"bobot"`
	SubCPMKs    []SubCPMKDTO `json:"sub_cpmks"`
}

type SubCPMKDTO struct {
	SubCPMKNumber int     `json:"sub_cpmk_number"`
	Description   string  `json:"description"`
	Bobot         float64 `json:"bobot"`
}

// GET /api/v1/sync/curriculum
func SyncCurriculumHandler(c *gin.Context) {
	// 1. Cek Security Key (Sederhana)
	secretKey := c.GetHeader("X-Sync-Key")
	if secretKey != "rahasia_dapur_fti_2025_jangan_disebar" { // Samakan dengan config SIM CPL
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	// 2. Query Data dari Database Smart RPS
	// (CATATAN: Anda perlu menyesuaikan query ini dengan nama tabel/model di Smart RPS Anda)

	/* CONTOH IMPLEMENTASI QUERY (Sesuaikan dengan Model Smart RPS Anda):
	var mks []model.MataKuliah
	// Preload sampai ke SubCPMK
	db.DB.Preload("CPMKs.SubCPMKs").Find(&mks)
	*/

	// --- MOCK DATA (Gunakan ini dulu untuk tes koneksi jika query DB belum siap) ---
	// Ini data bohong-bohongan biar SIM CPL bisa ngetes tarik data
	dummyData := []CourseDTO{
		{
			Code: "IF101", Title: "Algoritma Pemrograman", Credits: 3, Semester: 1,
			CPMKs: []CPMKDTO{
				{
					CPMKNumber: 1, Description: "Mampu memahami konsep dasar algoritma", Bobot: 50,
					SubCPMKs: []SubCPMKDTO{
						{SubCPMKNumber: 1, Description: "Menjelaskan flowchart", Bobot: 20},
						{SubCPMKNumber: 2, Description: "Membuat pseudocode", Bobot: 30},
					},
				},
				{
					CPMKNumber: 2, Description: "Mampu membuat program sederhana", Bobot: 50,
					SubCPMKs: []SubCPMKDTO{
						{SubCPMKNumber: 3, Description: "Coding Hello World", Bobot: 50},
					},
				},
			},
		},
		{
			Code: "IF102", Title: "Dasar Sistem Komputer", Credits: 2, Semester: 1,
			CPMKs: []CPMKDTO{
				{
					CPMKNumber: 1, Description: "Memahami hardware", Bobot: 100,
					SubCPMKs: []SubCPMKDTO{
						{SubCPMKNumber: 1, Description: "Merakit PC", Bobot: 100},
					},
				},
			},
		},
	}
	// -----------------------------------------------------------------------------

	c.JSON(http.StatusOK, SyncResponse{
		Data: dummyData, // Nanti ganti 'dummyData' dengan hasil query database
	})
}
