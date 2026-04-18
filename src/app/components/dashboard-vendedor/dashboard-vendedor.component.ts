import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/service/auth.service';

@Component({
  selector: 'app-dashboard-vendedor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-vendedor.component.html',
  styleUrls: ['./dashboard-vendedor.component.css']
})
export class DashboardVendedorComponent {

  usuario = this.auth.getUsuario();

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  irA(ruta: string): void {
    this.router.navigate([ruta]);
  }

  logout(): void {
    this.auth.logout().subscribe();
  }
}