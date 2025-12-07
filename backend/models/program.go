package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Program struct {
	ID        uuid.UUID      `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	ProdiID   *uuid.UUID     `json:"prodi_id,omitempty" gorm:"type:uuid"`
	Code      string         `json:"code" gorm:"unique;not null"`
	Name      string         `json:"name" gorm:"not null"`
	CreatedAt time.Time      `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt time.Time      `json:"updated_at" gorm:"autoUpdateTime"`
	DeletedAt gorm.DeletedAt `json:"deleted_at,omitempty" gorm:"index"`

	Prodi *Prodi `json:"prodi,omitempty" gorm:"foreignKey:ProdiID"`
}
