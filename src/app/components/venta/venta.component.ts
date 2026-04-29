import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { VentaService } from '../../core/service/venta.service';
import { ProductoService } from '../../core/service/producto.service';
import { AuthService } from '../../core/service/auth.service';
import { mensajeError } from '../../core/utils/http-error.util';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})
export class VentasComponent implements OnInit {

  // Registro de venta
  busqueda = '';
  productosFiltrados: any[] = [];
  carrito: any[] = [];
  metodoPago = '';
  totalVenta = 0;
  errorVenta = '';
  ventaExitosa = false;

  // Historial (solo ADMIN)
  esAdmin = false;
  puedeEscribir = false;
  puedeVerHistorial = false;
  sinPermiso = false;
  historial: any[] = [];
  mostrarHistorial = false;
  ventaDetalle: any = null;
  filtroDesde = '';
  filtroHasta = '';

  constructor(
    private ventaService: VentaService,
    private productoService: ProductoService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.esAdmin = this.authService.getRol() === 'ADMIN';
    this.puedeEscribir = this.esAdmin || this.authService.tienePermiso('Ventas_escritura');
    this.puedeVerHistorial = this.esAdmin || this.authService.tienePermiso('Ventas_lectura');
    if (!this.authService.tienePermiso('Ventas_lectura') && !this.esAdmin) {
      this.sinPermiso = true;
      return;
    }
    if (this.puedeVerHistorial) this.cargarHistorial();
  }

  buscarProducto(): void {
    if (!this.busqueda.trim()) { this.productosFiltrados = []; return; }
    this.productoService.buscar(this.busqueda).subscribe({
      next: (data) => this.productosFiltrados = data.filter(p => p.activo),
      error: () => this.productosFiltrados = []
    });
  }

  agregarAlCarrito(prod: any): void {
    const existente = this.carrito.find(i => i.id === prod.id);
    if (existente) {
      if (existente.cantidad < existente.stock) existente.cantidad++;
      else { this.errorVenta = `Stock máximo disponible: ${existente.stock}`; return; }
    } else {
      if (prod.stock === 0) { this.errorVenta = 'Producto sin stock disponible'; return; }
      this.carrito.push({ ...prod, cantidad: 1 });
    }
    this.errorVenta = '';
    this.calcularTotal();
    this.busqueda = '';
    this.productosFiltrados = [];
  }

  cambiarCantidad(item: any, cantidad: number): void {
    if (cantidad < 1) return;
    if (cantidad > item.stock) { this.errorVenta = `Stock máximo: ${item.stock}`; return; }
    item.cantidad = cantidad;
    this.errorVenta = '';
    this.calcularTotal();
  }

  eliminarItem(index: number): void {
    if (!confirm('¿Eliminar este producto del carrito?')) return;
    this.carrito.splice(index, 1);
    this.calcularTotal();
  }

  calcularTotal(): void {
    this.totalVenta = this.carrito.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
  }

  finalizarVenta(): void {
    if (!this.metodoPago) { this.errorVenta = 'Selecciona un método de pago'; return; }
    if (this.carrito.length === 0) { this.errorVenta = 'El carrito está vacío'; return; }
    if (!confirm(`¿Confirmar venta por S/ ${this.totalVenta.toFixed(2)} con método de pago ${this.metodoPago}?`)) return;

    const request = {
      metodoPago: this.metodoPago,
      detalles: this.carrito.map(i => ({ productoId: i.id, cantidad: i.cantidad }))
    };

    this.ventaService.registrar(request).subscribe({
      next: () => {
        this.ventaExitosa = true;
        this.carrito = [];
        this.totalVenta = 0;
        this.metodoPago = '';
        this.errorVenta = '';
        if (this.esAdmin) this.cargarHistorial();
        setTimeout(() => this.ventaExitosa = false, 3000);
      },
      error: (err) => this.errorVenta = mensajeError(err)
    });
  }

  // Historial
  cargarHistorial(): void {
    this.ventaService.listar().subscribe({
      next: (data) => this.historial = data,
      error: (err) => console.error(err)
    });
  }

  filtrarPorFecha(): void {
    if (!this.filtroDesde || !this.filtroHasta) return;
    const desde = `${this.filtroDesde}T00:00:00`;
    const hasta = `${this.filtroHasta}T23:59:59`;
    this.ventaService.filtrarPorFecha(desde, hasta).subscribe({
      next: (data) => this.historial = data,
      error: (err) => console.error(err)
    });
  }

  limpiarFiltros(): void {
    this.filtroDesde = '';
    this.filtroHasta = '';
    this.cargarHistorial();
  }

  verDetalle(venta: any): void { this.ventaDetalle = venta; }
  cerrarDetalle(): void { this.ventaDetalle = null; }

  irA(ruta: string): void { this.router.navigate([ruta]); }
}
