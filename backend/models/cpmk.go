package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type CPMK struct {
	ID          uuid.UUID      `gorm:"type:uuid;primary_key;default:gen_random_uuid()" json:"id"`
	CourseID    uuid.UUID      `gorm:"type:uuid;not null" json:"course_id"`
	CPMKNumber  int            `gorm:"not null" json:"cpmk_number"`
	Description string         `gorm:"type:text;not null" json:"description"`
	Bobot       *float64       `gorm:"type:decimal(5,2);default:0" json:"bobot,omitempty"` // Bobot dalam persen (0-100)
	MatchedCPL  string         `gorm:"type:text" json:"matched_cpl,omitempty"`             // Kode CPL yang di-mapping (CPL-01, CPL-02, dll)
	CreatedAt   time.Time      `gorm:"default:CURRENT_TIMESTAMP" json:"created_at"`
	UpdatedAt   time.Time      `gorm:"default:CURRENT_TIMESTAMP" json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`

	// Relations
	Course   Course    `gorm:"foreignKey:CourseID" json:"course,omitempty"`
	SubCPMKs []SubCPMK `gorm:"foreignKey:CPMKId" json:"sub_cpmks,omitempty"`
}

func (CPMK) TableName() string {
	return "cpmk"
}
