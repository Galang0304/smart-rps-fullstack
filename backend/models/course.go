package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Course struct {
	ID        uuid.UUID      `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	ProgramID *uuid.UUID     `json:"program_id,omitempty" gorm:"type:uuid"`
	Code      string         `json:"code" gorm:"not null"`
	Title     string         `json:"title" gorm:"not null"`
	Credits   *int           `json:"credits,omitempty"`
	Semester  *int           `json:"semester,omitempty"`
	Tahun     string         `json:"tahun" gorm:"not null;default:'2025'"`
	IsCommon  bool           `json:"is_common" gorm:"default:false"` // Mata kuliah umum (bisa di-assign ke multiple prodi)
	CreatedAt time.Time      `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt time.Time      `json:"updated_at" gorm:"autoUpdateTime"`
	DeletedAt gorm.DeletedAt `json:"deleted_at,omitempty" gorm:"index"`

	Program        *Program            `json:"program,omitempty" gorm:"foreignKey:ProgramID"`
	AssignedProdis []CourseProdiAssign `json:"assigned_prodis,omitempty" gorm:"foreignKey:CourseID"`
}

// CourseProdiAssign - Tabel relasi untuk assign mata kuliah umum ke prodi
type CourseProdiAssign struct {
	ID        uuid.UUID      `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	CourseID  uuid.UUID      `json:"course_id" gorm:"type:uuid;not null"`
	ProdiID   uuid.UUID      `json:"prodi_id" gorm:"type:uuid;not null"`
	CreatedAt time.Time      `json:"created_at" gorm:"autoCreateTime"`
	DeletedAt gorm.DeletedAt `json:"deleted_at,omitempty" gorm:"index"`

	Course *Course `json:"course,omitempty" gorm:"foreignKey:CourseID"`
	Prodi  *Prodi  `json:"prodi,omitempty" gorm:"foreignKey:ProdiID"`
}
