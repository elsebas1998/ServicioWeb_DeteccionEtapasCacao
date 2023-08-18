package config

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
)

const (
	AccessControlAllowHeaders = "Access-Control-Allow-Headers"
	AccessControlAllowOrigin  = "Access-Control-Allow-Origin"
)

func SendResponse(writer http.ResponseWriter, status int, payload interface{}) {
	writer.Header().Set("Content-Type", "application/json")
	writer.Header().Set(AccessControlAllowOrigin, "*")
	writer.Header().Set(AccessControlAllowHeaders, "Content-Type")
	writer.WriteHeader(status)
	response, _ := json.Marshal(payload)
	writer.Write(response)
}
func setCorsSetUp(next http.Handler) http.Handler {
	return http.HandlerFunc(
		func(w http.ResponseWriter, req *http.Request) {
			w.Header().Set(AccessControlAllowOrigin, "*")
			w.Header().Set("Access-Control-Allow-Credentials", "true")
			w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
			w.Header().Set(AccessControlAllowHeaders, "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
			next.ServeHTTP(w, req)
		})
}

func EnableCORS(router *mux.Router) {
	router.PathPrefix("/").HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		w.Header().Set(AccessControlAllowOrigin, "*")
	}).Methods(http.MethodOptions)
	router.Use(setCorsSetUp)
}
