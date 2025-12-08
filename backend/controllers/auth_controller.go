package controllers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/syrlramadhan/dokumentasi-rps-api/models"
	"github.com/syrlramadhan/dokumentasi-rps-api/services"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type AuthController struct {
	db           *gorm.DB
	emailService *services.EmailService
}

func NewAuthController(db *gorm.DB) *AuthController {
	return &AuthController{
		db:           db,
		emailService: services.NewEmailService(),
	}
}

type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type LoginResponse struct {
	Token string      `json:"token"`
	User  UserProfile `json:"user"`
}

type UserProfile struct {
	ID          uuid.UUID  `json:"id"`
	Username    string     `json:"username"`
	Email       *string    `json:"email,omitempty"`
	DisplayName *string    `json:"display_name,omitempty"`
	Role        string     `json:"role"`
	ProdiID     *uuid.UUID `json:"prodi_id,omitempty"`
}

func (ac *AuthController) Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid request",
			"message": "Username dan password harus diisi",
		})
		return
	}

	// Find user by username
	var user models.User
	if err := ac.db.Where("username = ?", req.Username).First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error":   "Login failed",
				"message": "Username atau password salah",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Terjadi kesalahan saat login",
		})
		return
	}

	// Verify password
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error":   "Login failed",
			"message": "Username atau password salah",
		})
		return
	}

	// Get prodi_id if user is kaprodi
	var prodiID *uuid.UUID
	if user.Role == "kaprodi" {
		var prodi models.Prodi
		if err := ac.db.Where("user_id = ?", user.ID).First(&prodi).Error; err == nil {
			prodiID = &prodi.ID
		}
	}

	// Generate token (simplified - in production use JWT)
	token := uuid.New().String()

	// Return success response
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Login berhasil",
		"data": LoginResponse{
			Token: token,
			User: UserProfile{
				ID:          user.ID,
				Username:    user.Username,
				Email:       user.Email,
				DisplayName: user.DisplayName,
				Role:        user.Role,
				ProdiID:     prodiID,
			},
		},
	})
}

func (ac *AuthController) Me(c *gin.Context) {
	// Get user from context (set by auth middleware)
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error":   "Unauthorized",
			"message": "Silakan login terlebih dahulu",
		})
		return
	}

	var user models.User
	if err := ac.db.First(&user, "id = ?", userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error":   "User not found",
			"message": "User tidak ditemukan",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": UserProfile{
			ID:          user.ID,
			Username:    user.Username,
			Email:       user.Email,
			DisplayName: user.DisplayName,
			Role:        user.Role,
		},
	})
}

func (ac *AuthController) Logout(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Logout berhasil",
	})
}

func (ac *AuthController) ChangePassword(c *gin.Context) {
	type ChangePasswordRequest struct {
		OldPassword string `json:"old_password" binding:"required"`
		NewPassword string `json:"new_password" binding:"required,min=6"`
	}

	var req ChangePasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid request",
			"message": "Password lama dan baru harus diisi",
		})
		return
	}

	userID, _ := c.Get("user_id")
	var user models.User
	if err := ac.db.First(&user, "id = ?", userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error":   "User not found",
			"message": "User tidak ditemukan",
		})
		return
	}

	// Verify old password
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.OldPassword)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error":   "Invalid password",
			"message": "Password lama tidak sesuai",
		})
		return
	}

	// Hash new password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Server error",
			"message": "Gagal mengenkripsi password baru",
		})
		return
	}

	// Update password
	user.Password = string(hashedPassword)
	user.UpdatedAt = time.Now()
	if err := ac.db.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Gagal mengupdate password",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Password berhasil diubah",
	})
}

func (ac *AuthController) ResetPassword(c *gin.Context) {
	type ResetPasswordRequest struct {
		Username    string `json:"username" binding:"required"`
		NewPassword string `json:"new_password" binding:"required,min=6"`
	}

	var req ResetPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid request",
			"message": "Username dan password baru harus diisi",
		})
		return
	}

	// Find user by username
	var user models.User
	if err := ac.db.Where("username = ?", req.Username).First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"error":   "User not found",
				"message": "User tidak ditemukan",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Terjadi kesalahan database",
		})
		return
	}

	// Hash new password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Server error",
			"message": "Gagal mengenkripsi password baru",
		})
		return
	}

	// Update password
	user.Password = string(hashedPassword)
	user.UpdatedAt = time.Now()
	if err := ac.db.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Gagal mengupdate password",
		})
		return
	}

	// Send email notification to user
	if user.Email != nil && *user.Email != "" {
		displayName := user.Username
		if user.DisplayName != nil && *user.DisplayName != "" {
			displayName = *user.DisplayName
		}

		go func() {
			if err := ac.emailService.SendKaprodiAccountEmail(
				*user.Email,
				displayName,
				user.Username,
				req.NewPassword,
			); err != nil {
				println("Warning: Failed to send password reset email:", err.Error())
			}
		}()
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Password berhasil direset dan email notifikasi telah dikirim",
		"data": gin.H{
			"username": user.Username,
			"email":    user.Email,
		},
	})
}
