package config

import (
	"crypto/sha512"
	"encoding/hex"
	"log"
)

// VerificarSHA512 compara una palabra con una versión encriptada (hash) utilizando SHA-512
// Devuelve true si la palabra coincide con el hash, de lo contrario devuelve false
func VerificarSHA512(palabra string, hash string) bool {
	hashed := EncriptarSHA512(palabra)
	log.Println(hashed)
	return hash == hashed
}

// EncriptarSHA512 encripta una palabra utilizando SHA-512 y devuelve el hash en formato hexadecimal
func EncriptarSHA512(palabra string) string {
	hasher := sha512.New()
	hasher.Write([]byte(palabra))
	hashed := hasher.Sum(nil)
	return hex.EncodeToString(hashed)
}
