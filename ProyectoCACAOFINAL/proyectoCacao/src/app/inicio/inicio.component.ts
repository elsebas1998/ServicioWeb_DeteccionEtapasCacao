import { Component, OnInit } from '@angular/core';
import { AuthService } from '../Services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { Md5Helper } from '../Services/md5.helper';
import { SecretTokenService } from '../Services/secret-token.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import swal from 'sweetalert2';
import jwt_decode from 'jwt-decode';

interface DecodedToken {
  email:string;
  jti:number;
}

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  foto_cacao: string;
  codigo:number;
  formCambiarFoto: FormGroup;
  selectedFile: File | null = null;
  btnstateFoto: boolean=true;
  textoFase:any = "";
  mostrarResultado: boolean = false;

  constructor(
    public authServices: AuthService,
    private cookieService: CookieService,
    private secretToken: SecretTokenService,
    private md5Helper: Md5Helper,
    private router:Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    const token = this.cookieService.get('token');
    if (token) {
      const decodedToken: DecodedToken = jwt_decode(token);
      const codigoId = decodedToken.jti;
      this.codigo = codigoId;
    } else{
      swal.fire({
        icon: 'error',
        text: 'Error al cargar tus datos, inicia sesión nuevamente!',
        confirmButtonColor: '#222323',
        confirmButtonText: 'ACEPTAR'
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/inicio']);
        }
      });
    }

    this.formCambiarFoto = this.fb.group(
      {
        imageFile: [null],
      }
    )
  }

  subirFoto(event: any) {
    const file = event.target.files[0];
    console.log(file);
    
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.foto_cacao = e.target.result;
        this.selectedFile = file;
        this.btnstateFoto = false; 
      };
      reader.readAsDataURL(file);
    }
    
  }

  SubirfotoCacao() {
    if (!this.selectedFile) {
      console.error('No se ha seleccionado una foto.');
      return;
    }
    const formData = new FormData();
    formData.append('file', this.selectedFile);

    console.log(formData);
    this.authServices.Prediccionevento(formData).subscribe((data:any) => {
      this.mostrarResultado = true;
      this.textoFase = `<span class="fw-bold">La fase es:</span> ${data}`;
      
      if(data === 6) {
        swal.fire({
          icon: 'success',
          title: 'Felicidades',
          text: 'Ya puedes cosechar',
          confirmButtonColor: '#6C3428',
          confirmButtonText: 'ACEPTAR',
          backdrop: 'static',
          allowOutsideClick: false,
        }).then((result) => {
          if (result.isConfirmed) {
            this.btnstateFoto = true;
          }
        });
      }
              
    }, error => {
      console.log(error);
      this.btnstateFoto = false;
    });   
  }
}
