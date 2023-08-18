package controllers

import (
	"APICACAO/config"
	"APICACAO/models"
	"APICACAO/validators"
	"encoding/json"
	"log"
	"net/http"
)

/*********************
******FUNCION LOGIN*********
*********************/

func Login(writer http.ResponseWriter, request *http.Request) {

	db := config.DatabaseConnectionPool //RECUPERAMOS LA CONEXION DEL POOL

	//RECUPERAMOS LOS DATOS DEL USARIO DEL CUERPO DE LA PETICION
	var user models.Login

	if error := json.NewDecoder(request.Body).Decode(&user); error != nil {
		log.Println(error)
		config.SendResponse(writer, http.StatusInternalServerError, map[string]interface{}{
			"status":      "ERROR",
			"status_code": "SELECT",
			"message":     "SERVER_ERROR",
		})
		return
	}

	//VALIDAMOS LOS CAMPOS
	errValidate, msg := validators.LoginValidate(user)
	if errValidate != nil {
		config.SendResponse(writer, http.StatusBadRequest, map[string]interface{}{
			"status":      "ERROR",
			"status_code": "SELECT",
			"message":     msg,
		})
		return
	}

	//VERIFICAMOS QUE EL USUARIO EXISTA
	var usr string
	var cont string
	var id int

	query := "SELECT id,user,pass FROM persona where user= ?;"

	rows := db.QueryRow(query, user.Username)
	err := rows.Scan(&id, &usr, &cont)
	if err != nil {
		log.Println(err)
		config.SendResponse(writer, http.StatusBadRequest, map[string]interface{}{
			"status":      "ERROR",
			"status_code": "SELECT",
			"message":     "CREDENCIALES_INCORRECTAS",
		})
		return
	}

	//VERIFICAR CONTRASEÑA

	pass := config.VerificarSHA512(user.Password, cont)
	if !pass {
		config.SendResponse(writer, http.StatusUnauthorized, map[string]interface{}{
			"status":      "ERROR",
			"status_code": "SELECT",
			"message":     "CREDENCIALES_INCORRECTAS",
		})
		return
	}

	//CREAR TOKEN

	token := config.GenerateToken(id, usr)

	if token == "error" {
		config.SendResponse(writer, http.StatusInternalServerError, map[string]interface{}{
			"status":      "ERROR",
			"status_code": "SELECT",
			"message":     "TOKEN_ERROR",
		})
		return
	}

	dataExsit := map[string]interface{}{
		"id":    id,
		"email": usr,
	}

	config.SendResponse(writer, http.StatusOK, map[string]interface{}{
		"status":      "OK",
		"status_code": "SELECT",
		"message":     "CREDENCIALES_CORRECTAS",
		"token":       token,
		"data":        dataExsit,
	})
}

func Save(writer http.ResponseWriter, request *http.Request) {

	estructura := models.PersonaSaveManual{} // TRAEMOS EL MODELO PERSONA

	//RECUPERAMOS LOS DATOS DEL CUERPO DE LA PETICION
	if error := json.NewDecoder(request.Body).Decode(&estructura); error != nil {
		config.SendResponse(writer, http.StatusBadRequest, map[string]interface{}{
			"status":      "ERROR",
			"status_code": "SELECT",
			"message":     "Datos de la peticion invalidos",
		})
		return
	}

	//VALIDAMOS LOS CAMPOS
	errValidate, msg := validators.SaveUserValidate(estructura)
	if errValidate != nil {
		config.SendResponse(writer, http.StatusBadRequest, map[string]interface{}{
			"status":      "ERROR",
			"status_code": "SELECT",
			"message":     msg,
		})
		return
	}

	direccion := ""
	if estructura.Direccion == "" {
		direccion = "SN"
	} else {
		direccion = estructura.Direccion
	}

	db := config.DatabaseConnectionPool //RECUPERAMOS LA CONEXION DEL POOL

	queryValidatorEmail := "SELECT user FROM persona WHERE user = ?"
	rowss, _ := db.Query(queryValidatorEmail, estructura.Username)
	defer rowss.Close()
	if rowss.Next() {
		config.SendResponse(writer, http.StatusBadRequest, map[string]interface{}{
			"status":      "ERROR",
			"status_code": "SELECT",
			"message":     "EL CORREO YA EXISTE, PRUEBE CON OTRO",
		})
		return
	}

	password := config.EncriptarSHA512(estructura.Password)

	sqlInsert := "INSERT INTO persona (nombre,user,pass,direccion) VALUES (?, ?,?,?)"

	result, err := db.Exec(sqlInsert, estructura.Nombre, estructura.Username, password, direccion)
	if err != nil {
		log.Println(err)
		config.SendResponse(writer, http.StatusInternalServerError, map[string]interface{}{
			"status":      "ERROR",
			"status_code": "SELECT",
			"message":     " Error al consultar en Base",
		})
		return
	}

	lastInsertID, _ := result.LastInsertId()
	token := config.GenerateToken(int(lastInsertID), estructura.Username)
	if token == "error" {
		config.SendResponse(writer, http.StatusInternalServerError, map[string]interface{}{
			"status":      "ERROR",
			"status_code": "SELECT",
			"message":     "Error generar token",
		})
		return
	}

	data := map[string]interface{}{
		"id":    lastInsertID,
		"email": estructura.Username,
	}

	config.SendResponse(writer, http.StatusCreated, map[string]interface{}{
		"status":      "OK",
		"status_code": "SELECT",
		"message":     "Registro guardado correctamente",
		"data":        data,
		"token":       token,
	})

}
