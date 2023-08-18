import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { RegistroComponent } from './registro/registro.component';

const routes: Routes = [
  { 
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  { 
    path: 'inicio',
    component: InicioComponent,
    canActivate:[AuthGuard]
  },
  { 
    path: 'login',
    component: LoginComponent,
  },
  { 
    path: 'registro',
    component: RegistroComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
