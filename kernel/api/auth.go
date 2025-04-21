package api

import (
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/siyuan-note/siyuan/kernel/model"
)

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Token string `json:"token"`
}

func handleLogin(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"code": -1, "msg": "invalid request"})
		return
	}

	// TODO: Add proper user authentication
	// For now, just check if username and password are not empty
	if req.Username == "" || req.Password == "" {
		c.JSON(401, gin.H{"code": -1, "msg": "invalid credentials"})
		return
	}

	// Create JWT token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"userID": req.Username,
		"exp":    time.Now().Add(time.Hour * 24).Unix(),
	})

	// Sign token with secret key
	tokenString, err := token.SignedString([]byte(model.Conf.System.JWTSecret))
	if err != nil {
		c.JSON(500, gin.H{"code": -1, "msg": "failed to generate token"})
		return
	}

	c.JSON(200, LoginResponse{Token: tokenString})
}

func RegisterAuthRoutes(r *gin.Engine) {
	r.POST("/api/auth/login", handleLogin)
} 