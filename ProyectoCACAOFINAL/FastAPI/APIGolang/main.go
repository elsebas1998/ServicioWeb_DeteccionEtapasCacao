package main

import (
	"APICACAO/config"
	"APICACAO/routes"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

func main() {
	config.InitPoolDB()

	router := mux.NewRouter()
	routes.SetAuthRoutes(router)
	config.EnableCORS(router)
	//CONFIGURACION SERVIDOR HTTP
	server := http.Server{
		Addr:      ":443",
		Handler:   router,
		TLSConfig: config.ConfigTls(),
	}

	log.Println("Servidor ejecutandose sobre el puerto " + server.Addr)

	err := server.ListenAndServeTLS("../certs/server.crt", "../certs/server.key")
	if err != nil {
		log.Println("server listen error:", err)
		serverLocal := http.Server{
			Addr:    ":8000",
			Handler: router,
		}
		log.Println("Servidor ejecutandose sobre el puerto " + serverLocal.Addr)
		log.Println(serverLocal.ListenAndServe())
	}

}
