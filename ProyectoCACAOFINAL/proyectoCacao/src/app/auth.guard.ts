import { Injectable } from '@angular/core';
import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { AuthService } from './Services/auth.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  constructor(
    private authServices: AuthService,
    private router:Router
  ){}

  canActivate(): boolean{
    // Si existe un token en la cabecera inicia sesion y se navega por pagina de inicio de sesion
    if(this.authServices.loggetIn()){
      return true;
    }
    // Si no existe un token en cabecera se redirige al login
    this.router.navigate(['/login'])
    return false;
  }  
}
