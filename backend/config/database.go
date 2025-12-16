package config

import (
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func NewPostgresConnection() (*gorm.DB, error) {
	dsn := GetDatabaseURL()

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})

	if err != nil {
		return nil, err
	}

	log.Println("✓ Connected to PostgreSQL database")
	return db, nil
}

// GetSilentDB returns a DB instance with silent logger for operations
// This helps avoid verbose logs during schema introspection
func GetSilentDB(db *gorm.DB) *gorm.DB {
	return db.Session(&gorm.Session{
		Logger: logger.Default.LogMode(logger.Silent),
	})
}
