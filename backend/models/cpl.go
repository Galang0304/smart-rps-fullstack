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
	CPL       string         `gorm:"column:cpl;type:text;not null" json:"cpl"`
	CreatedAt time.Time      `gorm:"default:CURRENT_TIMESTAMP" json:"created_at"`
	UpdatedAt time.Time      `gorm:"default:CURRENT_TIMESTAMP" json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`

	// Relations
	Prodi      Prodi          `gorm:"foreignKey:ProdiID" json:"prodi,omitempty"`
	Indikators []CPLIndikator `gorm:"foreignKey:CPLID" json:"indikators,omitempty"`
}

func (CPL) TableName() string {
	return "cpl"
}

type CPLIndikator struct {
	ID             uuid.UUID      `gorm:"type:uuid;primary_key;default:gen_random_uuid()" json:"id"`
	CPLID          uuid.UUID      `gorm:"type:uuid;not null" json:"cpl_id"`
	IndikatorKerja string         `gorm:"type:text;not null" json:"indikator_kerja"`
	Urutan         int            `gorm:"type:int;not null" json:"urutan"`
	CreatedAt      time.Time      `gorm:"default:CURRENT_TIMESTAMP" json:"created_at"`
	UpdatedAt      time.Time      `gorm:"default:CURRENT_TIMESTAMP" json:"updated_at"`
	DeletedAt      gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`

	// Relations
	CPL CPL `gorm:"foreignKey:CPLID" json:"cpl,omitempty"`
}

func (CPLIndikator) TableName() string {
	return "cpl_indikator"
}
