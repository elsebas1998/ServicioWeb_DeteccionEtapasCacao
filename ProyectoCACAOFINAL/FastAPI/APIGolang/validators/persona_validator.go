package validators

import (
	"APICACAO/models"
	"reflect"

	"github.com/go-playground/validator/v10"
)

func LoginValidate(estructura models.Login) (error, string) {
	var validate *validator.Validate

	validate = validator.New()
	err := validate.Struct(estructura)
	if err != nil {

		errors, ok := err.(validator.ValidationErrors)
		if !ok {

			return errors, ""
		}
		for _, e := range errors {
			msg := e.Tag()
			if field, ok := reflect.TypeOf(models.Login{}).FieldByName(e.Field()); ok {
				msg = field.Tag.Get("validateMsg")
			}

			return errors, msg
		}

	}

	return nil, ""
}

func SaveUserValidate(estructura models.PersonaSaveManual) (error, string) {
	var validate *validator.Validate

	validate = validator.New()

	err := validate.Struct(estructura)
	if err != nil {
		errors, ok := err.(validator.ValidationErrors)
		if !ok {

			return errors, ""
		}
		for _, e := range errors {
			msg := e.Tag()
			if field, ok := reflect.TypeOf(models.PersonaSaveManual{}).FieldByName(e.Field()); ok {
				msg = field.Tag.Get("validateMsg")
			}

			return errors, msg
		}

	}
	return nil, ""
}
