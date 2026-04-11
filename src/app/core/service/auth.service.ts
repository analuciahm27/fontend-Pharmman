import { Injectable } from '@angular/core';
import { Usuario } from '../model/usuario';
import { USUARIOS_MOCK } from '../data/usuario.data';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 private usuarioActual: Usuario | null = null;

  constructor(private router: Router) {
    const data = sessionStorage.getItem('usuario');
    if (data) this.usuarioActual = JSON.parse(data);
  }

  login(email: string, password: string): boolean {
    const encontrado = USUARIOS_MOCK.find(
      u => u.email === email && u.passwordHash === password && u.estado
    );
    if (encontrado) {
      this.usuarioActual = encontrado;
      sessionStorage.setItem('usuario', JSON.stringify(encontrado));
      return true;
    }
    return false;
  }

  logout(): void {
    this.usuarioActual = null;
    sessionStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }

  getUsuario(): Usuario | null {
    return this.usuarioActual;
  }

  getRol(): string | null {
    return this.usuarioActual?.rol ?? null;
  }

  isLoggedIn(): boolean {
    return !!this.usuarioActual;
  }
}
