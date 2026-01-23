package middleware

import (
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

func SyncAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// 1. Ambil key dari Header Request
		clientKey := c.GetHeader("X-Sync-Key")
		serverKey := os.Getenv("SYNC_SECRET_KEY")

		// 2. Validasi
		if serverKey == "" {
			// Safety check: Jika server belum di-setup key-nya, tolak semua request
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Server Sync Key not configured"})
			return
		}

		if clientKey != serverKey {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Akses Ditolak: Kunci salah"})
			return
		}

		c.Next()
	}
}
