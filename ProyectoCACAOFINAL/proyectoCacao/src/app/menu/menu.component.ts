import { Component, ElementRef } from '@angular/core';
import { AuthService } from '../Services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';

interface DecodedToken {
  email:string;
  jti:number;
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {

  codigo:number;

  constructor(
    public authServices: AuthService,
    private router:Router,
    private cookieService: CookieService,
    private el: ElementRef
  ){}

  ngOnInit(): void {
    const token = this.cookieService.get('token');
    if (token) {
      const decodedToken: DecodedToken = jwt_decode(token);
      const codigoId = decodedToken.jti;
      this.codigo = codigoId;
    } else {
      console.log('No se encontró ningún token en el almacenamiento local.');
    }
 
  }
}
