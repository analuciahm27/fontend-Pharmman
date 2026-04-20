import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap, catchError, of } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private url = environment.apiUrl;

  private usuarioSubject = new BehaviorSubject<any>(null);
  public usuario$ = this.usuarioSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.verificarSesion().subscribe();
  }

  // Método vital: consulta el endpoint /me que creamos en Spring Boot
  verificarSesion(): Observable<any> {
    return this.http.get(`${this.url}/auth/me`).pipe(
      tap(user => this.usuarioSubject.next(user)),
      catchError(() => {
        this.usuarioSubject.next(null);
        return of(null);
      })
    );
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.url}/auth/login`, { email, password }).pipe(
      tap((resp: any) => {
        // Actualizamos el estado en memoria. Ya no hay sessionStorage.setItem
        this.usuarioSubject.next(resp);
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.url}/auth/logout`, {}).pipe(
      tap(() => {
        // Limpiamos la memoria y redirigimos
        this.usuarioSubject.next(null);
        this.router.navigate(['/login']);
      })
    );
  }

  // Métodos de utilidad usando el valor actual del Subject
  getUsuario(): any {
    return this.usuarioSubject.value;
  }

  getRol(): string | null {
    return this.usuarioSubject.value?.rol ?? null;
  }

  tienePermiso(permiso: string): boolean {
    return this.usuarioSubject.value?.permisos?.includes(permiso) ?? false;
  }

  isLoggedIn(): boolean {
    return !!this.usuarioSubject.value;
  }
}