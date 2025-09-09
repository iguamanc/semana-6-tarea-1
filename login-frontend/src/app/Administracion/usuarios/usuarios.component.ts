import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UsuariosService } from '../../Services/usuarios.service';
import { IUsuario } from '../../interfases/iusuario';
declare const Swal: any;
@Component({
  selector: 'app-usuarios',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css',
})
export class UsuariosComponent implements OnInit {
  lista_usuarios$!: IUsuario[];

  constructor(private usuarioServicio: UsuariosService) {}

  ngOnInit() {
    this.cargaTabla();
  }
  cargaTabla() {
    this.usuarioServicio.todos().subscribe((usuarios) => {
      this.lista_usuarios$ = usuarios;
    });
  }

  eliminarUsuario(usuario: any) {
    Swal.fire({
      title: usuario.nombre,
      text: 'Esta seguro que desea eliminar este usuario?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#838688ff',
      confirmButtonText: 'Eliminar!',
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.usuarioServicio
          .eliminarUsuario(usuario.id)
          .subscribe((usuario) => {
            if (usuario > 0) {
              this.cargaTabla();
              Swal.fire(
                'Usuario Eliminado!',
                'Gracias por confiar en nuestros servicios!.',
                'success'
              );
            }
          });
      }
    });
  }
}
