import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../Services/auth.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Md5Helper } from '../Services/md5.helper';
import swal from 'sweetalert2'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formLogin: FormGroup;
  passwordType: string = 'password';
  iconEye: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router:Router,
    private cookieService: CookieService,
    private md5Helper: Md5Helper,
  ) {}

  ngOnInit(): void {
    this.validationFormLogin();
  }

  // Valida el contenido del formulario
  validationFormLogin(): void {
    this.formLogin = this.fb.group(
      {
        username : new FormControl('', [Validators.required, Validators.email]),
        password : new FormControl('', [Validators.required]),

      }
    )
  }

  // Metodo para mostrar la contraseña u ocultarla
  mostrarPassword(): void {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';   // cambio de type en el input de password a text y viceversa
    this.iconEye = !this.iconEye;  // cambio del icono de la contraseña (en el html se encuentran sus valores)
  }

  // Inicio de sesion
  login() {
    // Comprueba si los campos del formulario son validos
    if(this.formLogin.valid) {
      this.authService.signUp(this.formLogin.value).subscribe(res=>{    // Uso del metodo que consime la API de registro
        if(res.status === 'OK'){    // Si el resultado es correcto se puede iniciar sesion
          swal.fire({
            icon: 'success',
            text: res.message,
            confirmButtonColor: '#6C3428',
            confirmButtonText: 'ACEPTAR',
            backdrop: 'static',
            allowOutsideClick: false,
          }).then((result) => {
            if (result.isConfirmed) {
              this.cookieService.set('token', res.token);    // Guarda el token de inicio de sesion en la cabecera
              this.router.navigate(['/inicio'])
            }
          });
        }else{
          swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: res.message,
            confirmButtonColor: '#6C3428',
            confirmButtonText: 'ACEPTAR',
            backdrop: 'static',
            allowOutsideClick: false,
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/login']);
            }
          });      
        }
      }, error => {
        swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.error.message,
          confirmButtonColor: '#6C3428',
          confirmButtonText: 'ACEPTAR',
          backdrop: 'static',
          allowOutsideClick: false,
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['/login']);
          }
        });      
      });
    } else{
      swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Los campos ingresados son invalidos',
        confirmButtonColor: '#6C3428',
        confirmButtonText: 'ACEPTAR',
        backdrop: 'static',
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/login']);
        }
      });     

    }
  }
}
