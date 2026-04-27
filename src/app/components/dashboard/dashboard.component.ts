import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  fecha = new Date();

  get usuario() { return this.auth.getUsuario(); }
  get esAdmin() { return this.auth.getRol() === 'ADMIN'; }

  saludo(): string {
    const hora = this.fecha.getHours();
    if (hora < 12) return 'Buenos días';
    if (hora < 18) return 'Buenas tardes';
    return 'Buenas noches';
  }

  tieneAcceso(modulo: string): boolean {
    return this.esAdmin || this.auth.tienePermiso(`${modulo}_lectura`);
  }

  constructor(private auth: AuthService, private router: Router) {}

  irA(ruta: string): void { this.router.navigate([ruta]); }

  logout(): void { this.auth.logout().subscribe(); }
}
