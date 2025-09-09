import { Routes } from '@angular/router';
import { ClienteComponent } from './cliente/cliente.component';
import { UsuariosComponent } from './Administracion/usuarios/usuarios.component';
import { RolesComponent } from './Administracion/roles/roles.component';
import { AccesosComponent } from './Administracion/accesos/accesos.component';
import { NuevoClienteComponent } from './cliente/nuevo-cliente/nuevo-cliente.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './Services/auth.guard';
import { NuevoUsuarioComponent } from './Administracion/usuarios/nuevo-usuario/nuevo-usuario.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: ClienteComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
  },
  {
    path: 'nuevo-cliente',
    component: NuevoClienteComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
  },
  {
    path: 'editar-cliente/:parametro',
    component: NuevoClienteComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
  },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'usuario',
        component: UsuariosComponent,
      },
      {
        path: 'nuevo-usuario',
        component: NuevoUsuarioComponent,
      },
      {
        path: 'editar-usuario/:parametro',
        component: NuevoUsuarioComponent,
      },
      {
        path: 'roles',
        component: RolesComponent,
      },
      {
        path: 'accesos',
        component: AccesosComponent,
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
