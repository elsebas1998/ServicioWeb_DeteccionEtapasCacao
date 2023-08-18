package models

import "github.com/golang-jwt/jwt/v5"

type Login struct {
	Username string `json:"username" validate:"required,email" validateMsg:"EL USUARIO ES UN CAMPO REQUERIDO Y DEBE TENER EL FORMATO ADECUADO"`
	Password string `json:"password" validate:"required" validateMsg:"LA CONTRASEÑA ES UN CAMPO REQUERIDO"`
}

type MyCustomClaims struct {
	Email string `json:"email"`
	Name  string `json:"name"`
	jwt.RegisteredClaims
}

type PersonaSaveManual struct {
	Nombre    string `json:"nombre" validate:"required,min=3,max=100" validateMsg:"El nombre es requerido y debe tener entre 3 y 100 caracteres"`
	Username  string `json:"username" validate:"required,email" validateMsg:"EL USUARIO ES UN CAMPO REQUERIDO Y DEBE TENER EL FORMATO ADECUADO"`
	Password  string `json:"password" validate:"required" validateMsg:"LA CONTRASEÑA ES UN CAMPO REQUERIDO"`
	Direccion string `json:"direccion" validate:"max=250" validateMsg:"La dirección no debe exceder los 250 caracteres"`
}
