package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Course struct {
	ID        uuid.UUID      `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	ProgramID *uuid.UUID     `json:"program_id,omitempty" gorm:"type:uuid"`
	Code      string         `json:"code" gorm:"unique;not null"`
	Title     string         `json:"title" gorm:"not null"`
	Credits   *int           `json:"credits,omitempty"`
	Semester  *int           `json:"semester,omitempty"`
	CreatedAt time.Time      `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt time.Time      `json:"updated_at" gorm:"autoUpdateTime"`
	DeletedAt gorm.DeletedAt `json:"deleted_at,omitempty" gorm:"index"`

	Program *Program `json:"program,omitempty" gorm:"foreignKey:ProgramID"`
}
