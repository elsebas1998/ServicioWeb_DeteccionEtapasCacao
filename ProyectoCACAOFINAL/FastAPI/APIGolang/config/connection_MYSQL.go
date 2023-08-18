package config

import (
	"database/sql"
	"log"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

var (
	DatabaseConnectionPool *sql.DB
)

//CONEXION DE PRUEBA POOL DE CONEXIONES

func InitPoolDB() {
	connectionString := "root:@tcp(localhost:3306)/proyectocacao"
	var err error
	DatabaseConnectionPool, err = sql.Open("mysql", connectionString)
	if err != nil {
		log.Println(err.Error()) // Error Handling = manejo de errores
	}
	DatabaseConnectionPool.SetConnMaxLifetime(time.Minute * 5)
	DatabaseConnectionPool.SetConnMaxIdleTime(time.Minute * 3)
	DatabaseConnectionPool.SetMaxOpenConns(10) //700
	DatabaseConnectionPool.SetMaxIdleConns(10) //700
	err = DatabaseConnectionPool.Ping()
	if err != nil {
		log.Println(err)
	}
	log.Println("Conexión a la base de datos exitosa")
}
