import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/service/auth.service';
import { ProductoService } from '../../core/service/producto.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  fecha = new Date();
  sidebarAbierto = false;
  productosStockCritico: any[] = [];
  readonly UMBRAL_STOCK = 10;

  get usuario() { return this.auth.getUsuario(); }
  get esAdmin() { return this.auth.getRol() === 'ADMIN'; }
  get puedeVerProductos(): boolean {
    return this.esAdmin || this.auth.tienePermiso('Productos_lectura');
  }

  saludo(): string {
    const hora = this.fecha.getHours();
    if (hora < 12) return 'Buenos días';
    if (hora < 18) return 'Buenas tardes';
    return 'Buenas noches';
  }

  tieneAcceso(modulo: string): boolean {
    return this.esAdmin || this.auth.tienePermiso(`${modulo}_lectura`);
  }

  toggleSidebar(): void { this.sidebarAbierto = !this.sidebarAbierto; }
  cerrarSidebar(): void { this.sidebarAbierto = false; }

  constructor(private auth: AuthService, private router: Router, private productoService: ProductoService) {}

  ngOnInit(): void {
    if (this.puedeVerProductos) {
      this.productoService.listar().subscribe({
        next: (productos) => {
          this.productosStockCritico = productos
            .filter(p => p.activo && p.stock <= this.UMBRAL_STOCK)
            .sort((a, b) => a.stock - b.stock);
        },
        error: () => {}
      });
    }
  }

  irA(ruta: string): void { this.cerrarSidebar(); this.router.navigate([ruta]); }

  logout(): void { this.auth.logout().subscribe(); }
}
