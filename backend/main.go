package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/syrlramadhan/dokumentasi-rps-api/config"
	"github.com/syrlramadhan/dokumentasi-rps-api/models"
	"github.com/syrlramadhan/dokumentasi-rps-api/routes"
)

func main() {
	// Load environment variables
	config.LoadEnv()

	// Connect to PostgreSQL database
	db, err := config.NewPostgresConnection()
	if err != nil {
		log.Fatalf("Failed to connect to PostgreSQL: %v", err)
	}

	// Auto migrate all models
	err = db.AutoMigrate(
		&models.User{},
		&models.Prodi{},
		&models.Program{},
		&models.Dosen{},
		&models.Course{},
		&models.Template{},
		&models.TemplateVersion{},
		&models.GeneratedRPS{},
		&models.DosenRPSAccess{},
	)
	if err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}

	log.Println("✓ Database migration completed successfully")

	// Setup Gin router
	r := gin.Default()

	// CORS middleware
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE, PATCH")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	// Setup routes
	routes.SetupRoutes(r, db)

	// Get port from environment variable
	port := os.Getenv("APP_PORT")
	if port == "" {
		port = "8080"
	}

	// Start server
	log.Printf("✓ Server starting on http://localhost:%s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
