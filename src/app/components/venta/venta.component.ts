import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { VentaService } from '../../core/service/venta.service';
import { ProductoService } from '../../core/service/producto.service';
import { Venta } from '../../core/model/venta';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})
export class VentasComponent implements OnInit {
  carrito: any[] = [];
  totalVenta: number = 0;
  metodoPago: string = 'Efectivo';

  // Datos simulados para el buscador
  busqueda: string = '';
  productosFiltrados: any[] = [];
  productosDB = [
    { id: 1, nombre: 'Paracetamol 500mg', precio: 0.50, stock: 100 },
    { id: 2, nombre: 'Ibuprofeno 400mg', precio: 1.20, stock: 50 }
  ];

  constructor(
  private ventaService: VentaService,    // Para guardar la venta
  private productoService: ProductoService, // Para buscar productos reales
  private router: Router
) {}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  buscarProducto() {
    this.productosFiltrados = this.productosDB.filter(p => 
      p.nombre.toLowerCase().includes(this.busqueda.toLowerCase())
    );
  }

  agregarAlCarrito(prod: any) {
    const item = { ...prod, cantidad: 1, subtotal: prod.precio };
    this.carrito.push(item);
    this.calcularTotal();
    this.busqueda = '';
    this.productosFiltrados = [];
  }

  calcularTotal() {
    this.totalVenta = this.carrito.reduce((acc, item) => acc + item.subtotal, 0);
  }

  eliminarItem(index: number) {
    this.carrito.splice(index, 1);
    this.calcularTotal();
  }

  finalizarVenta() {
    const nuevaVenta: Venta = {
      metodoPago: this.metodoPago,
      total: this.totalVenta,
      usuarioId: 1, // Basado en tu SQL (Carlos García)
      detalles: this.carrito.map(item => ({
        productoId: item.id,
        cantidad: item.cantidad,
        precioUnitario: item.precio,
        subtotal: item.precio * item.cantidad
      }))
    };

    this.ventaService.registrarVenta(nuevaVenta).subscribe({
      next: (response) => {
        alert('Venta realizada con éxito');
        this.carrito = [];
        this.totalVenta = 0;
      },
      error: (err) => console.error(err)
    });
  }
  regresar() { this.router.navigate(['/dashboard']); }
}