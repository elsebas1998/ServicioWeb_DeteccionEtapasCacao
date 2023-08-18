import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../Services/auth.service';
import { Router } from '@angular/router';
import { Md5Helper } from '../Services/md5.helper';
import { CookieService } from 'ngx-cookie-service';
import swal from 'sweetalert2'

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {

  formRegistro: FormGroup;
  passwordType: string = 'password';
  iconEye: boolean = false;
  passwordConfirmarType: string = 'password';
  iconEyeConfirmar: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router:Router,
    private cookieService: CookieService,
    private md5Helper: Md5Helper,
  ) {}

  ngOnInit(): void {
    this.validationFormRegistro();
  }

  // Valida el contenido del formulario
  validationFormRegistro(): void {
    this.formRegistro = this.fb.group(
      {
        nombre : new FormControl('', [Validators.required, Validators.minLength(3)]),
        username : new FormControl('', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]),
        direccion: new FormControl('', [Validators.required, Validators.minLength(3)]),
        password : new FormControl('', [Validators.required, Validators.minLength(8)]),
        passwordConfirmar : new FormControl('', [Validators.required, Validators.minLength(8)]),
      }
    )
  }

  // Metodo para mostrar la contraseña u ocultarla
  mostrarPassword(): void {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password'; // cambio de type en el input de password a text y viceversa
    this.iconEye = !this.iconEye; // cambio del icono de la contraseña (en el html se encuentran sus valores)
  }

  // Metodo para mostrar la contraseña u ocultarla
  mostrarPasswordConfirmar() {
    this.passwordConfirmarType = this.passwordConfirmarType === 'password' ? 'text' : 'password';  // cambio de type en el input de password a text y viceversa
    this.iconEyeConfirmar = !this.iconEyeConfirmar; // cambio del icono de la contraseña (en el html se encuentran sus valores)
  }

  // Cuanta la camtidad de subdominios para validar el correo electronico (subdominio: .com.ec.gob)
  conteoSubDominios(email: string): number {
    return (email.match(/\./g) || []).length; // Cuenta la cantidad de puntos (subdominios)
  }

  // Valida para que solo se ingresen numero en los capos de cedula y telefono
  valideInputNumber(event: KeyboardEvent) {
    const tecla = event.key;
    const codigoTecla = event.keyCode || event.which;

    // Permitir solo teclas numéricas y las teclas de navegación
    if (/[0-9]|ArrowLeft|ArrowRight|Delete|Backspace/.test(tecla)) {
      return true;
    }
    // Restringir cualquier otra tecla
    return false;
  }

  registrarse() {
    const maxSubdomains = 2;
    console.log(this.formRegistro.value);

    if(this.formRegistro.value.nombre != "") {   // Valida si se ingreso datos en el campo nombre
      if(this.formRegistro.value.cedula != "") {   // Valida si se ingreso datos en el campo cedula
        if(this.formRegistro.value.correo != "") {   // Valida si se ingreso datos en el campo correo
          if(this.formRegistro.value.telefono != "") {   // Valida si se ingreso datos en el campo telefono
            if(this.formRegistro.value.password != "") {   // Valida si se ingreso datos en el campo password
              if(this.formRegistro.value.passwordConfirmar != "") {   // Valida si se ingreso datos en el campo confirmar password

                if(this.formRegistro.value.password === this.formRegistro.value.passwordConfirmar) { // Confirma la similitud entre password y confirmar password
                  if(this.conteoSubDominios(this.formRegistro.value.username) <= maxSubdomains) {   // Valida para que los subdominios del correo no sobrepasen al 2 que es el maximo
                    console.log(this.formRegistro.value);

                    // Llamada del metodo que consume la API de registro 
                    this.authService.registro(this.formRegistro.value).subscribe(res=>{
                      swal.fire({
                        icon: 'success',
                        text: "Cuenta creada exitosamente",
                        confirmButtonColor: '#222323',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'ACEPTAR',
                        backdrop: 'static',
                        allowOutsideClick: false,
                      }).then((result) => {
                        if (result.isConfirmed) {
                          this.cookieService.set('token', res.token);
                          this.router.navigate(['/inicio'])
                        }
                      });
                    }, err => {
                      swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: err.error.message,
                        confirmButtonColor: '#222323',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'ACEPTAR',
                        backdrop: 'static',
                        allowOutsideClick: false,
                      })
                    })
                  } else {
                    swal.fire({
                      icon: 'error',
                      html: 'Correo electrónico invalido. <br>Por favor ingresar un correo electrónico valido.',
                      confirmButtonColor: '#222323',
                      confirmButtonText: 'ACEPTAR'
                    });
                  }
                } else {
                  swal.fire({
                    icon: 'error',
                    text: 'Las contraseñas no coinciden',
                    confirmButtonColor: '#222323',
                    confirmButtonText: 'ACEPTAR'
                  });
                }

              } else {
                swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  html: 'No se aceptan campos vacios. <br>Ingrese al confirmación de contraseña.',
                  confirmButtonColor: '#6C3428',
                  confirmButtonText: 'ACEPTAR',
                  backdrop: 'static',
                  allowOutsideClick: false,
                })
              }
            } else {
              swal.fire({
                icon: 'error',
                title: 'Oops...',
                html: 'No se aceptan campos vacios. <br>Ingrese una contraseña.',
                confirmButtonColor: '#6C3428',
                confirmButtonText: 'ACEPTAR',
                backdrop: 'static',
                allowOutsideClick: false,
              })
            }
          } else {
            swal.fire({
              icon: 'error',
              title: 'Oops...',
              html: 'No se aceptan campos vacios. <br>Ingrese un número de teléfono.',
              confirmButtonColor: '#6C3428',
              confirmButtonText: 'ACEPTAR',
              backdrop: 'static',
              allowOutsideClick: false,
            })
          }
        } else {
          swal.fire({
            icon: 'error',
            title: 'Oops...',
            html: 'No se aceptan campos vacios. <br>Ingrese un correo.',
            confirmButtonColor: '#6C3428',
            confirmButtonText: 'ACEPTAR',
            backdrop: 'static',
            allowOutsideClick: false,
          })
        }
      } else {
        swal.fire({
          icon: 'error',
          title: 'Oops...',
          html: 'No se aceptan campos vacios. <br>Ingrese una cédula.',
          confirmButtonColor: '#6C3428',
          confirmButtonText: 'ACEPTAR',
          backdrop: 'static',
          allowOutsideClick: false,
        })  
      }
    } else {
      swal.fire({
        icon: 'error',
        title: 'Oops...',
        html: 'No se aceptan campos vacios. <br>Ingrese un nombre.',
        confirmButtonColor: '#6C3428',
        confirmButtonText: 'ACEPTAR',
        backdrop: 'static',
        allowOutsideClick: false,
      })  
    }
  }
}
