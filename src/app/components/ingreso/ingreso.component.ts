import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IngresoService } from '../../core/service/ingreso.service';
import { ProductoService } from '../../core/service/producto.service';
import { AuthService } from '../../core/service/auth.service';

@Component({
  selector: 'app-ingreso',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ingreso.component.html',
  styleUrls: ['./ingreso.component.css']
})
export class IngresoComponent implements OnInit {

  // Registro
  busqueda = '';
  productosFiltrados: any[] = [];
  items: { producto: any; cantidad: number }[] = [];
  errorMsg = '';
  exitoso = false;

  // Historial (solo ADMIN)
  esAdmin = false;
  historial: any[] = [];
  mostrarHistorial = false;

  constructor(
    private ingresoService: IngresoService,
    private productoService: ProductoService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.esAdmin = this.authService.getRol() === 'ADMIN';
    if (this.esAdmin) this.cargarHistorial();
  }

  buscarProducto(): void {
    if (!this.busqueda.trim()) { this.productosFiltrados = []; return; }
    this.productoService.buscar(this.busqueda).subscribe({
      next: (data) => this.productosFiltrados = data,
      error: () => this.productosFiltrados = []
    });
  }

  agregarItem(prod: any): void {
    const existente = this.items.find(i => i.producto.id === prod.id);
    if (existente) { existente.cantidad++; }
    else { this.items.push({ producto: prod, cantidad: 1 }); }
    this.busqueda = '';
    this.productosFiltrados = [];
    this.errorMsg = '';
  }

  eliminarItem(index: number): void { this.items.splice(index, 1); }

  confirmarIngreso(): void {
    if (this.items.length === 0) { this.errorMsg = 'Agrega al menos un producto'; return; }

    const request = {
      detalles: this.items.map(i => ({ productoId: i.producto.id, cantidad: i.cantidad }))
    };

    this.ingresoService.registrar(request).subscribe({
      next: () => {
        this.exitoso = true;
        this.items = [];
        this.errorMsg = '';
        if (this.esAdmin) this.cargarHistorial();
        setTimeout(() => this.exitoso = false, 3000);
      },
      error: (err) => this.errorMsg = err.error?.mensaje || 'Error al registrar el ingreso'
    });
  }

  cargarHistorial(): void {
    this.ingresoService.listar().subscribe({
      next: (data) => this.historial = data,
      error: (err) => console.error(err)
    });
  }

  irA(ruta: string): void { this.router.navigate([ruta]); }
}
