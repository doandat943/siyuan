package api

import (
	"github.com/gin-gonic/gin"
)

func ServeAPI(r *gin.Engine) {
	// Register auth routes first
	RegisterAuthRoutes(r)

	// Register other API routes
	// ... existing code ...
} 