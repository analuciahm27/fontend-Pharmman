import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap, catchError, of, map } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private url = environment.apiUrl;

  private usuarioSubject = new BehaviorSubject<any>(null);
  public usuario$ = this.usuarioSubject.asObservable();

  // Control de inactividad (30 minutos = 1800000 ms)
  private readonly INACTIVITY_TIMEOUT = 30 * 60 * 1000;
  private inactivityTimer: any = null;
  private inactivityInitialized = false;

  constructor(private http: HttpClient, private router: Router) {
    this.verificarSesion().subscribe();
  }

verificarSesion(): Observable<any> {
  return this.http.get(`${this.url}/auth/me`).pipe(
    tap(user => this.usuarioSubject.next(user)),
    map(user => user), 
    catchError(() => {
      this.usuarioSubject.next(null);
      return of(null);
    })
  );
}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.url}/auth/login`, { email, password }).pipe(
      tap((resp: any) => {
        this.usuarioSubject.next(resp);
        if (!this.inactivityInitialized) {
          this.initInactivityTracker();
          this.inactivityInitialized = true;
        }
        this.resetInactivityTimer();
        if (resp.mustChangePassword) {
          this.router.navigate(['/update-password']);
        }
      })
    );
  }

 logout(): Observable<any> {
  return this.http.post(`${this.url}/auth/logout`, {}, { withCredentials: true }).pipe(
    tap(() => {
      this.usuarioSubject.next(null);
      this.router.navigate(['/login'], { queryParams: { reason: 'logout' } });
    }),
    catchError(() => {
      this.usuarioSubject.next(null);
      this.router.navigate(['/login'], { queryParams: { reason: 'logout' } });
      return of(null);
    })
  );
}

  // ==================== CONTROL DE INACTIVIDAD ====================

  private initInactivityTracker(): void {
    // Eventos que reinician el timer
    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'].forEach(event => {
      document.addEventListener(event, () => this.resetInactivityTimer(), true);
    });
  }

  private resetInactivityTimer(): void {
    this.clearInactivityTimer();
    if (this.isLoggedIn()) {
      this.inactivityTimer = setTimeout(() => {
        this.logoutByInactivity();
      }, this.INACTIVITY_TIMEOUT);
    }
  }

  private clearInactivityTimer(): void {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = null;
    }
  }

  private logoutByInactivity(): void {
    this.http.post(`${this.url}/auth/logout`, {}).subscribe({
      next: () => {
        this.clearInactivityTimer();
        this.usuarioSubject.next(null);
        this.router.navigate(['/login'], { 
          queryParams: { reason: 'inactivity' } 
        });
      },
      error: () => {
        this.clearInactivityTimer();
        this.usuarioSubject.next(null);
        this.router.navigate(['/login'], { 
          queryParams: { reason: 'inactivity' } 
        });
      }
    });
  }

  // Métodos de utilidad usando el valor actual del Subject
  getUsuario(): any {
    return this.usuarioSubject.value;
  }

  getRol(): string | null {
    return this.usuarioSubject.value?.rol ?? null;
  }

  // permiso: 'MODULO_lectura' o 'MODULO_escritura'
  tienePermiso(permiso: string): boolean {
    const permisos: any[] = this.usuarioSubject.value?.permisos ?? [];
    const [modulo, tipo] = permiso.split('_');
    return permisos.some(p =>
      p.modulo?.toUpperCase() === modulo?.toUpperCase() && p[tipo] === true
    );
  }

  isLoggedIn(): boolean {
    return !!this.usuarioSubject.value;
  }
}