package config

import (
	"APICACAO/models"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

const secret_key = "ProyectoCacao"

func GenerateToken(id int, email string) string {

	claims := models.MyCustomClaims{
		Email: email,
		RegisteredClaims: jwt.RegisteredClaims{
			// A usual scenario is to set the expiration time relative to the current time
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
			Issuer:    "SERVER_GOLANG",
			//Subject:   "somebody",
			ID: strconv.Itoa(id),
			//Audience:  []string{"somebody_else"},
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString([]byte(secret_key))
	if err != nil {
		return "error"
	}

	return tokenString

}

func VerifyToken(tokenString string) (string, string) {

	claims := &models.MyCustomClaims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(secret_key), nil
	})

	if err != nil {
		if err == jwt.ErrSignatureInvalid {
			//w.WriteHeader(http.StatusUnauthorized)
			return "401", ""
		}
		//w.WriteHeader(http.StatusBadRequest)
		//token expired
		return "401", ""
	}
	if !token.Valid {
		//w.WriteHeader(http.StatusUnauthorized)
		return "401", ""
	}

	return claims.Email, claims.ID

}
