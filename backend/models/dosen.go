package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Dosen struct {
	ID                uuid.UUID      `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	UserID            *uuid.UUID     `json:"user_id,omitempty" gorm:"type:uuid"`
	ProdiID           *uuid.UUID     `json:"prodi_id,omitempty" gorm:"type:uuid"`
	NIDN              string         `json:"nidn" gorm:"column:nidn;unique;not null"`
	NamaLengkap       string         `json:"nama_lengkap" gorm:"not null"`
	Email             string         `json:"email" gorm:"unique;not null"`
	NoTelepon         string         `json:"no_telepon,omitempty"`
	JabatanFungsional string         `json:"jabatan_fungsional,omitempty"`
	IsActive          bool           `json:"is_active" gorm:"default:true"`
	CreatedAt         time.Time      `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt         time.Time      `json:"updated_at" gorm:"autoUpdateTime"`
	DeletedAt         gorm.DeletedAt `json:"deleted_at,omitempty" gorm:"index"`

	User    *User    `json:"user,omitempty" gorm:"foreignKey:UserID"`
	Prodi   *Prodi   `json:"prodi,omitempty" gorm:"foreignKey:ProdiID"`
	Courses []Course `json:"courses,omitempty" gorm:"many2many:dosen_courses;"`
}

type DosenRPSAccess struct {
	ID             uuid.UUID      `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	DosenID        uuid.UUID      `json:"dosen_id" gorm:"type:uuid;not null"`
	GeneratedRPSID uuid.UUID      `json:"generated_rps_id" gorm:"type:uuid;not null"`
	AccessLevel    string         `json:"access_level" gorm:"not null;default:'read'"`
	GrantedBy      *uuid.UUID     `json:"granted_by,omitempty" gorm:"type:uuid"`
	CreatedAt      time.Time      `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt      time.Time      `json:"updated_at" gorm:"autoUpdateTime"`
	DeletedAt      gorm.DeletedAt `json:"deleted_at,omitempty" gorm:"index"`

	Dosen        *Dosen        `json:"dosen,omitempty" gorm:"foreignKey:DosenID"`
	GeneratedRPS *GeneratedRPS `json:"generated_rps,omitempty" gorm:"foreignKey:GeneratedRPSID"`
	Granter      *User         `json:"granter,omitempty" gorm:"foreignKey:GrantedBy"`
}
