package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type CPL struct {
	ID        uuid.UUID      `gorm:"type:uuid;primary_key;default:gen_random_uuid()" json:"id"`
	ProdiID   uuid.UUID      `gorm:"type:uuid;not null" json:"prodi_id"`
	KodeCPL   string         `gorm:"type:text;not null" json:"kode_cpl"`
	Komponen  string         `gorm:"type:text;not null" json:"komponen"`
	Deskripsi string         `gorm:"type:text;not null" json:"deskripsi"`
	CreatedAt time.Time      `gorm:"default:CURRENT_TIMESTAMP" json:"created_at"`
	UpdatedAt time.Time      `gorm:"default:CURRENT_TIMESTAMP" json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`

	// Relations
	Prodi Prodi `gorm:"foreignKey:ProdiID" json:"prodi,omitempty"`
}

func (CPL) TableName() string {
	return "cpl"
}
