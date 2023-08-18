import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import swal from 'sweetalert2'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Direccion URL para el consumo de las APIs de Golang
  private URL = 'http://localhost:8000';
  // Direccion URL para el consumo de las APIs de Python
  private URLPython= 'http://localhost:8001';

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private router:Router,
  ) { }

  // Consumo de la API para iniciar sesion
  signUp(user:any){
    return this.http.post<any>(`${this.URL}/auth/api/login`, user);
  }

  // Metodo para comprobar si existe un token o no (Se usa en el archivo auth.guard.ts)
  loggetIn(){
    return !!this.cookieService.get('token');
  }

  // Mostrar mensaje de si desea cerrar sesion
  Confirmarlogout(){
    swal.fire({
      text: '¿Estás seguro que quieres cerrar sesión?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar sesión',
      confirmButtonColor: '#6C3428',
      cancelButtonColor: "#BA704F",
      buttonsStyling: true,
      customClass: {
        cancelButton: 'm-2',
        confirmButton: 'm-2 order-1',
      },
      backdrop: 'static',
      allowOutsideClick: false,
    }).then((result) => {    // Accion del boton "Sí, cerrar sesión"
      if (result.isConfirmed) {
        this.logout();
      }
    });
  }

  // Accion de cerrar sesion
  logout(){
    swal.fire({
      icon: 'success',
      text: 'Se ha cerrado sesión correctamente',
      confirmButtonColor: '#6C3428',
      confirmButtonText: 'ACEPTAR',
      backdrop: 'static',
      allowOutsideClick: false,
    }).then((result) => { // Accion del boton "Aceptar"
      if (result.isConfirmed) {
        this.cookieService.deleteAll('token');   // Elimina el valor almacenado en el token de cabecera
        this.router.navigate(['/login']); // Redirige a la pagina del Login
      }
    });
  }

  // Metodo para obtener el token del usuario en cabecera
  getToken(){
    return this.cookieService.get('token');
  }

  registro(user:any) {
    return this.http.post<any>(`${this.URL}/auth/api/registro`, user);
  }

  // Consumo de la API de Python para predecir la fase del cacao
  Prediccionevento(formData: FormData) {
    const tokenAuthorization = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${tokenAuthorization}`);
    return this.http.post<any>(`${this.URLPython}/upload/`, formData, { headers });
  }
}
