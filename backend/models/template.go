package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type Template struct {
	ID          uuid.UUID      `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	ProgramID   *uuid.UUID     `json:"program_id,omitempty" gorm:"type:uuid"`
	Name        string         `json:"name" gorm:"not null"`
	Description *string        `json:"description,omitempty"`
	CreatedBy   *uuid.UUID     `json:"created_by,omitempty" gorm:"type:uuid"`
	IsActive    bool           `json:"is_active" gorm:"default:true"`
	CreatedAt   time.Time      `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt   time.Time      `json:"updated_at" gorm:"autoUpdateTime"`
	DeletedAt   gorm.DeletedAt `json:"deleted_at,omitempty" gorm:"index"`

	Program *Program `json:"program,omitempty" gorm:"foreignKey:ProgramID"`
	Creator *User    `json:"creator,omitempty" gorm:"foreignKey:CreatedBy"`
}

type TemplateVersion struct {
	ID         uuid.UUID      `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	TemplateID *uuid.UUID     `json:"template_id,omitempty" gorm:"type:uuid"`
	Version    int            `json:"version" gorm:"not null"`
	Definition datatypes.JSON `json:"definition" gorm:"type:jsonb"`
	CreatedBy  *uuid.UUID     `json:"created_by,omitempty" gorm:"type:uuid"`
	CreatedAt  time.Time      `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt  time.Time      `json:"updated_at" gorm:"autoUpdateTime"`
	DeletedAt  gorm.DeletedAt `json:"deleted_at,omitempty" gorm:"index"`

	Template *Template `json:"template,omitempty" gorm:"foreignKey:TemplateID"`
	Creator  *User     `json:"creator,omitempty" gorm:"foreignKey:CreatedBy"`
}
