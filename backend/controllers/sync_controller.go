package controllers

import (
	"net/http"
	"smart-rps-backend/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type SyncController struct {
	DB *gorm.DB
}

func NewSyncController(db *gorm.DB) *SyncController {
	return &SyncController{DB: db}
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
	MatchedCPL  string       `json:"matched_cpl"` // <--- TAMBAHAN PENTING
	SubCPMKs    []SubCPMKDTO `json:"sub_cpmks"`
}

type SubCPMKDTO struct {
	SubCPMKNumber int     `json:"sub_cpmk_number"`
	Description   string  `json:"description"`
	Bobot         float64 `json:"bobot"`
}

func (ctrl *SyncController) SyncCurriculum(c *gin.Context) {
	secretKey := c.GetHeader("X-Sync-Key")
	if secretKey != "rahasia_dapur_fti_2025_jangan_disebar" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized access"})
		return
	}

	var courses []models.Course
	if err := ctrl.DB.Preload("CPMKs.SubCPMKs").Find(&courses).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error", "details": err.Error()})
		return
	}

	var data []CourseDTO
	for _, crs := range courses {
		cCredits := 0
		if crs.Credits != nil {
			cCredits = *crs.Credits
		}
		cSemester := 0
		if crs.Semester != nil {
			cSemester = *crs.Semester
		}

		var cpmkList []CPMKDTO
		for _, cpmk := range crs.CPMKs {
			var subList []SubCPMKDTO
			for _, sub := range cpmk.SubCPMKs {
				sBobot := 0.0
				if sub.Bobot != nil {
					sBobot = *sub.Bobot
				}

				subList = append(subList, SubCPMKDTO{
					SubCPMKNumber: sub.SubCPMKNumber,
					Description:   sub.Description,
					Bobot:         sBobot,
				})
			}

			cBobot := 0.0
			if cpmk.Bobot != nil {
				cBobot = *cpmk.Bobot
			}

			// Parse MatchedCPL dari DB Smart RPS
			cMatchedCPL := cpmk.MatchedCPL // Pastikan field ini ada di model CPMK Smart RPS Anda

			cpmkList = append(cpmkList, CPMKDTO{
				CPMKNumber:  cpmk.CPMKNumber,
				Description: cpmk.Description,
				Bobot:       cBobot,
				MatchedCPL:  cMatchedCPL, // <--- KIRIM DATA INI
				SubCPMKs:    subList,
			})
		}

		data = append(data, CourseDTO{
			Code:     crs.Code,
			Title:    crs.Title,
			Credits:  cCredits,
			Semester: cSemester,
			CPMKs:    cpmkList,
		})
	}

	c.JSON(http.StatusOK, gin.H{"data": data})
}
