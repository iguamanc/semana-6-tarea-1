import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UsuariosService } from '../../../Services/usuarios.service';
declare const Swal: any;

@Component({
  selector: 'app-nuevo-usuario',
  imports: [RouterLink, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './nuevo-usuario.component.html',
  styleUrl: './nuevo-usuario.component.css',
})
export class NuevoUsuarioComponent implements OnInit {
  usuarioforms: FormGroup = new FormGroup({});
  titulo_formulario = 'Registro de nuevo usuario';
  id: number = 0;
  Editar: boolean = false;
  constructor(
    private usuariosService: UsuariosService,
    private navegacion: Router,
    private parametros: ActivatedRoute
  ) {
    this.usuarioforms = new FormGroup({
      nombre: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      pwd: new FormControl('', [Validators.required, Validators.minLength(8)]),
      correo: new FormControl('', [Validators.required, Validators.email]),
    });
    this.parametros.params.subscribe((parametros) => {
      if (parametros['parametro']) {
        //actualizar
        this.titulo_formulario = 'Actualizar datos de usuario';
        this.id = parametros['parametro'];
        this.Editar = true;
        this.usuariosService.unusUario(this.id).subscribe((usuario) => {
          this.usuarioforms.patchValue({
            nombre: usuario.nombre,
            correo: usuario.correo,
          });
        });
      } else {
        //nuevo usuario
        this.usuarioforms.reset();
      }
    });
  }

  ngOnInit() {}
  guardarUsuario() {
    if (this.usuarioforms.invalid) {
      console.log('Formulario invalido');
      return;
    }
    Swal.fire({
      title: 'Desea guardar la informacion del usuario?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      denyButtonText: `Cancelar`,
      icon: 'question',
    }).then((result: any) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        if (this.Editar == true) {
          const usuario = this.usuarioforms.value;
          usuario.id = this.id;
          this.usuariosService
            .actualizarUsuario(usuario)
            .subscribe((usuario) => {
              if (usuario == null) {
                Swal.fire('usuarios', 'Error al guardar', 'error');
              }
              Swal.fire('usuarios', 'Se guardo con exito', 'success');
              this.usuarioforms.reset();
              this.navegacion.navigate(['/admin/usuario']);
            });
        } else {
          const usuario = this.usuarioforms.value;
          this.usuariosService
            .guardarUsuario(usuario)
            .subscribe((unusuario) => {
              Swal.fire('usuarios', 'Se guardo con exito', 'success');
              this.usuarioforms.reset();
              this.navegacion.navigate(['/admin/usuario']);
            });
        }
      } else if (result.isDenied) {
        Swal.fire('usuarios', 'El usuario cancelo la operacion', 'success');
      }
    });
  }
}
