import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private url = environment.apiUrl;
  private usuario: any = null;

  constructor(private http: HttpClient, private router: Router) {
    // recupera datos del usuario al recargar
    const data = sessionStorage.getItem('usuario');
    if (data) this.usuario = JSON.parse(data);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.url}/auth/login`, { email, password }).pipe(
      tap((resp: any) => {
        // guarda datos del usuario pero NO el token
        // el token vive en la cookie HttpOnly
        this.usuario = resp;
        sessionStorage.setItem('usuario', JSON.stringify(resp));
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.url}/auth/logout`, {}).pipe(
      tap(() => {
        this.usuario = null;
        sessionStorage.removeItem('usuario');
        this.router.navigate(['/login']);
      })
    );
  }

  getUsuario(): any {
    return this.usuario;
  }

  getRol(): string | null {
    return this.usuario?.rol ?? null;
  }

  tienePermiso(permiso: string): boolean {
    return this.usuario?.permisos?.includes(permiso) ?? false;
  }

  isLoggedIn(): boolean {
    return !!this.usuario;
  }
}