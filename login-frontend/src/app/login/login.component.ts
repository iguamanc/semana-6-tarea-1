import { Component } from '@angular/core';
import { AuthService } from '../Services/auth.service';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;
  mensaje: string = '';
  constructor(
    private auth: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.auth
        .login(this.loginForm.value.email, this.loginForm.value.password)
        .subscribe({
          next: () => {
            // Login exitoso
            this.router.navigate(['/admin/usuario']);
          },
          error: (err) => {
            // Manejo del error
            console.error('Error en login:', err);
            // Si tu API devuelve { mensaje: '...' } en el body
            this.mensaje = err.error?.mensaje || 'Ocurrió un error en el login';
          },
        });

      // Aquí va la lógica de autenticación
    } else {
      console.log('Formulario no válido');
    }
  }
}
