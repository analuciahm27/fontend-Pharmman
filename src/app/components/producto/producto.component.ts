import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductoService } from '../../core/service/producto.service';
import { Producto } from '../../core/model/producto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-producto',
  standalone: true, // Asegúrate de que esto esté en true si es un componente standalone
  imports: [CommonModule], // <--- 2. Añadirlo aquí
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {
  productos: Producto[] = [];
  loading: boolean = false;
  mostrarModalProducto = false;
  modoEdicion = false;
  formProducto = {
      id: null,
      codigo: '',
      nombre: '',
      descripcion: '',
      precio: 0,
      stock: 0,
      categoriaId: null,
      activo: true
    };

  constructor(
    private productoService: ProductoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.obtenerProductos();
  }

  obtenerProductos(): void {
    this.loading = true;
    this.productoService.listarTodos().subscribe({
      next: (data) => {
        this.productos = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar productos', err);
        this.loading = false;
      }
    });
  }

  regresar(): void {
    this.router.navigate(['/dashboard']);
  }

  // Métodos para futuras implementaciones
  editarProducto(producto: Producto) {
    console.log('Editando:', producto.nombre);
  }

  eliminarProducto(id: number) {
    if(confirm('¿Está seguro de eliminar este producto?')) {
      this.productoService.eliminar(id).subscribe(() => this.obtenerProductos());
    }
  }
  
// ==========NUEVO PRODUCTO===========
  abrirModalCrear() {
      this.modoEdicion = false;
      this.formProducto = { id: null, codigo: '', nombre: '', descripcion: '', precio: 0, stock: 0, categoriaId: null, activo: true };
      this.mostrarModalProducto = true;
    }

    cerrarModal() {
      this.mostrarModalProducto = false;
    }

    guardarProducto() {
      // Aquí irá la lógica para llamar a tu ProductoService
      console.log('Datos a enviar a MySQL:', this.formProducto);
      this.cerrarModal();
    }
}
