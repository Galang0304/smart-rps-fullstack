package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type SubCPMK struct {
	ID            uuid.UUID      `gorm:"type:uuid;primary_key;default:gen_random_uuid()" json:"id"`
	CPMKId        uuid.UUID      `gorm:"type:uuid;not null" json:"cpmk_id"`
	SubCPMKNumber int            `gorm:"not null" json:"sub_cpmk_number"`
	Description   string         `gorm:"type:text;not null" json:"description"`
	CreatedAt     time.Time      `gorm:"default:CURRENT_TIMESTAMP" json:"created_at"`
	UpdatedAt     time.Time      `gorm:"default:CURRENT_TIMESTAMP" json:"updated_at"`
	DeletedAt     gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`

	// Relations
	CPMK CPMK `gorm:"foreignKey:CPMKId" json:"cpmk,omitempty"`
}

func (SubCPMK) TableName() string {
	return "sub_cpmk"
}
