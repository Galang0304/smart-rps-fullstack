package routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/syrlramadhan/dokumentasi-rps-api/controllers"
	"gorm.io/gorm"
)

func SetupRoutes(r *gin.Engine, db *gorm.DB) {
	// Initialize controllers
	authController := controllers.NewAuthController(db)
	prodiController := controllers.NewProdiController(db)
	dosenController := controllers.NewDosenController(db)
	programController := controllers.NewProgramController(db)
	courseController := controllers.NewCourseController(db)
	generatedRPSController := controllers.NewGeneratedRPSController(db)
	aiController := controllers.NewAIController()

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":  "ok",
			"message": "SMART RPS API is running",
		})
	})

	// API v1 group
	v1 := r.Group("/api/v1")
	{
		// Auth routes
		auth := v1.Group("/auth")
		{
			auth.POST("/login", authController.Login)
			auth.POST("/logout", authController.Logout)
			auth.GET("/me", authController.Me)
			auth.POST("/change-password", authController.ChangePassword)
			auth.POST("/reset-password", authController.ResetPassword) // Admin only
		}

		// Users routes
		users := v1.Group("/users")
		{
			users.GET("", func(c *gin.Context) {
				c.JSON(http.StatusOK, gin.H{"message": "Get all users - TODO"})
			})
		}

		// Prodis routes
		prodis := v1.Group("/prodis")
		{
			prodis.GET("", prodiController.GetAll)
			prodis.GET("/active", prodiController.GetAllActive)
			prodis.GET("/:id", prodiController.GetByID)
			prodis.POST("", prodiController.Create)
			prodis.PUT("/:id", prodiController.Update)
			prodis.DELETE("/:id", prodiController.Delete)
		}

		// Programs routes
		programs := v1.Group("/programs")
		{
			programs.GET("", programController.GetAll)
			programs.GET("/:id", programController.GetByID)
			programs.POST("", programController.Create)
			programs.PUT("/:id", programController.Update)
			programs.DELETE("/:id", programController.Delete)
		}

		// Courses routes
		courses := v1.Group("/courses")
		{
			courses.GET("", courseController.GetAll)
			courses.GET("/:id", courseController.GetById)
			courses.GET("/program/:id", courseController.GetByProgramId)
			courses.POST("", courseController.Create)
			courses.PUT("/:id", courseController.Update)
			courses.DELETE("/:id", courseController.Delete)
			courses.POST("/import", courseController.ImportCSV)
		}

		// Dosens routes
		dosens := v1.Group("/dosens")
		{
			dosens.GET("", dosenController.GetAll)
			dosens.GET("/:id", dosenController.GetByID)
			dosens.POST("", dosenController.Create)
			dosens.PUT("/:id", dosenController.Update)
			dosens.DELETE("/:id", dosenController.Delete)
			dosens.POST("/:id/courses", dosenController.AssignCourses)
			dosens.GET("/:id/courses", dosenController.GetDosenCourses)
		}

		// Templates routes
		templates := v1.Group("/templates")
		{
			templates.GET("", func(c *gin.Context) {
				c.JSON(http.StatusOK, gin.H{"message": "Get all templates - TODO"})
			})
		}

		// Generated RPS routes
		generated := v1.Group("/generated")
		{
			generated.GET("", generatedRPSController.GetAll)
			generated.GET("/:id", generatedRPSController.GetById)
			generated.POST("", generatedRPSController.Create)
			generated.POST("/draft", generatedRPSController.CreateDraft)
			generated.PUT("/:id", generatedRPSController.Update)
			generated.PATCH("/:id/status", generatedRPSController.UpdateStatus)
			generated.DELETE("/:id", generatedRPSController.Delete)
			generated.GET("/:id/export", generatedRPSController.Export)
		}

		// AI Helper routes
		ai := v1.Group("/ai")
		{
			ai.GET("/health", aiController.HealthCheck)
			ai.GET("/types", aiController.GetTypes)
			ai.POST("/generate/cpmk", aiController.GenerateCPMK)
			ai.POST("/generate/sub-cpmk", aiController.GenerateSubCPMK)
			ai.POST("/generate/topik", aiController.GenerateTopik)
			ai.POST("/generate/tugas", aiController.GenerateTugas)
			ai.POST("/generate/referensi", aiController.GenerateReferensi)
		}
	}
}
