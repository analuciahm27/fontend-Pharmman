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

  usuario = this.auth.getUsuario();
  esAdmin = this.auth.getRol() === 'ADMIN';

  constructor(private auth: AuthService, private router: Router) {}

  irA(ruta: string): void { this.router.navigate([ruta]); }

  logout(): void { this.auth.logout().subscribe(); }
}
