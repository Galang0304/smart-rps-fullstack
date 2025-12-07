package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Prodi struct {
	ID           uuid.UUID      `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	UserID       *uuid.UUID     `json:"user_id,omitempty" gorm:"type:uuid"`
	ProgramID    *uuid.UUID     `json:"program_id,omitempty" gorm:"type:uuid"`
	KodeProdi    string         `json:"kode_prodi" gorm:"unique;not null"`
	NamaProdi    string         `json:"nama_prodi" gorm:"not null"`
	Fakultas     string         `json:"fakultas" gorm:"not null"`
	Jenjang      string         `json:"jenjang" gorm:"not null"`
	EmailKaprodi string         `json:"email_kaprodi" gorm:"not null"`
	NamaKaprodi  string         `json:"nama_kaprodi" gorm:"not null"`
	IsActive     bool           `json:"is_active" gorm:"default:true"`
	CreatedAt    time.Time      `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt    time.Time      `json:"updated_at" gorm:"autoUpdateTime"`
	DeletedAt    gorm.DeletedAt `json:"deleted_at,omitempty" gorm:"index"`

	User    *User    `json:"user,omitempty" gorm:"foreignKey:UserID"`
	Program *Program `json:"program,omitempty" gorm:"foreignKey:ProgramID"`
}
