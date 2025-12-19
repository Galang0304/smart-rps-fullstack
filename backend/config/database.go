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

	// Configure connection pool to prevent "too many connections" error
	sqlDB, err := db.DB()
	if err != nil {
		return nil, err
	}

	// Set maximum number of open connections
	sqlDB.SetMaxOpenConns(10)
	// Set maximum number of idle connections
	sqlDB.SetMaxIdleConns(5)
	// Set maximum lifetime of a connection (in seconds)
	// sqlDB.SetConnMaxLifetime(time.Hour)

	log.Println("✓ Connected to PostgreSQL database with connection pooling")
	return db, nil
}

// GetSilentDB returns a DB instance with silent logger for operations
// This helps avoid verbose logs during schema introspection
func GetSilentDB(db *gorm.DB) *gorm.DB {
	return db.Session(&gorm.Session{
		Logger: logger.Default.LogMode(logger.Silent),
	})
}
