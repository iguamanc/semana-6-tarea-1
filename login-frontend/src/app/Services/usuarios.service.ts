import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { IUsuario } from '../interfases/iusuario';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private readonly rutaAPI = 'http://localhost:5000/api/Usuarios';
  constructor(private http: HttpClient) {}

  todos(): Observable<IUsuario[]> {
    var usuarios = this.http
      .get<IUsuario[]>(this.rutaAPI, { withCredentials: true })
      .pipe(catchError(this.manejoErrores));
    return usuarios;
  }
  manejoErrores(error: HttpErrorResponse) {
    const msg = error.error?.message || error.statusText || 'Error de red';
    return throwError(() => {
      new Error(msg);
    });
  }

  guardarUsuario(usuario: IUsuario): Observable<IUsuario> {
    return this.http
      .post<IUsuario>(this.rutaAPI, usuario, { withCredentials: true })
      .pipe(catchError(this.manejoErrores));
  }
  actualizarUsuario(usuario: IUsuario): Observable<IUsuario> {
    return this.http
      .put<IUsuario>(`${this.rutaAPI}/${usuario.id}`, usuario, { withCredentials: true })
      .pipe(catchError(this.manejoErrores));
  }
  unusUario(id: number): Observable<IUsuario> {
    return this.http
      .get<IUsuario>(`${this.rutaAPI}/${id}` , { withCredentials: true })
      .pipe(catchError(this.manejoErrores));
  }
  eliminarUsuario(id: number): Observable<number> {
    return this.http
      .delete<number>(`${this.rutaAPI}/${id}` , { withCredentials: true })
      .pipe(catchError(this.manejoErrores));
  }
}
