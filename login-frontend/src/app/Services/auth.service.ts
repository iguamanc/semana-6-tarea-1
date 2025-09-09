import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/Autenticacion';

  // Estado de autenticación
  private loggedIn = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient) {
    // Revisar token al iniciar (si usas cookies, depende de tu backend)
    this.checkSession().subscribe({
      next: res => this.loggedIn.next(true),
      error: () => this.loggedIn.next(false)
    });
  }

  login(correo: string, contrasena: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { correo, contrasena }, { withCredentials: true })
      .pipe(
        tap(() => this.loggedIn.next(true)) // actualizar estado al loguearse
      );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true })
      .pipe(
        tap(() => this.loggedIn.next(false)) // actualizar estado al cerrar sesión
      );
  }

  checkSession(): Observable<any> {
    return this.http.get(`${this.apiUrl}/session`, { withCredentials: true })
      .pipe(
        tap(() => this.loggedIn.next(true))
      );
  }

  // Método para usar en app.component.ts
  isLoggedIn(): boolean {
    return this.loggedIn.value;
  }
}
