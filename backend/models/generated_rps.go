package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type GeneratedRPS struct {
	ID                uuid.UUID      `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	TemplateVersionID *uuid.UUID     `json:"template_version_id,omitempty" gorm:"type:uuid"`
	CourseID          *uuid.UUID     `json:"course_id,omitempty" gorm:"type:uuid"`
	GeneratedBy       *uuid.UUID     `json:"generated_by,omitempty" gorm:"type:uuid"`
	Status            string         `json:"status" gorm:"default:'draft'"`
	Result            datatypes.JSON `json:"result,omitempty" gorm:"type:jsonb"`
	ExportedFileURL   *string        `json:"exported_file_url,omitempty"`
	AIMetadata        datatypes.JSON `json:"ai_metadata,omitempty" gorm:"type:jsonb"`
	CreatedAt         time.Time      `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt         time.Time      `json:"updated_at" gorm:"autoUpdateTime"`
	DeletedAt         gorm.DeletedAt `json:"deleted_at,omitempty" gorm:"index"`

	TemplateVersion *TemplateVersion `json:"template_version,omitempty" gorm:"foreignKey:TemplateVersionID"`
	Course          *Course          `json:"course,omitempty" gorm:"foreignKey:CourseID"`
	Generator       *User            `json:"generator,omitempty" gorm:"foreignKey:GeneratedBy"`
}
