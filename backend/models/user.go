package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	ID          uuid.UUID      `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	Username    string         `json:"username" gorm:"unique;not null"`
	Password    string         `json:"-" gorm:"not null"`
	Email       *string        `json:"email,omitempty" gorm:"unique"`
	DisplayName *string        `json:"display_name,omitempty"`
	Role        string         `json:"role" gorm:"not null;default:'viewer'"`
	CreatedAt   time.Time      `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt   time.Time      `json:"updated_at" gorm:"autoUpdateTime"`
	DeletedAt   gorm.DeletedAt `json:"deleted_at,omitempty" gorm:"index"`
}
