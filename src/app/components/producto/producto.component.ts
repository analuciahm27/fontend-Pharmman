import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductoService } from '../../core/service/producto.service';
import { CategoriaService } from '../../core/service/categoria.service';
import { AuthService } from '../../core/service/auth.service';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {

  productos: any[] = [];
  categorias: any[] = [];
  mostrarModal = false;
  mostrarModalCategoria = false;
  modoEdicion = false;
  productoSeleccionado: any = null;
  errorMsg = '';
  busqueda = '';
  esAdmin = false;

  form = { codigo: '', nombre: '', descripcion: '', precio: 0, categoriaId: null as number | null };
  formCategoria = { nombre: '' };
  categoriaEditandoId: number | null = null;

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.esAdmin = this.authService.getRol() === 'ADMIN';
    this.cargarProductos();
    this.cargarCategorias();
  }

  cargarProductos(): void {
    this.productoService.listar().subscribe({
      next: (data) => this.productos = data,
      error: (err) => console.error(err)
    });
  }

  cargarCategorias(): void {
    this.categoriaService.listar().subscribe({
      next: (data) => this.categorias = data,
      error: (err) => console.error(err)
    });
  }

  buscar(): void {
    if (!this.busqueda.trim()) { this.cargarProductos(); return; }
    this.productoService.buscar(this.busqueda).subscribe({
      next: (data) => this.productos = data,
      error: (err) => console.error(err)
    });
  }

  abrirModalCrear(): void {
    this.modoEdicion = false;
    this.productoSeleccionado = null;
    this.form = { codigo: '', nombre: '', descripcion: '', precio: 0, categoriaId: null };
    this.errorMsg = '';
    this.mostrarModal = true;
  }

  abrirModalEditar(p: any): void {
    this.modoEdicion = true;
    this.productoSeleccionado = p;
    this.form = { codigo: p.codigo, nombre: p.nombre, descripcion: p.descripcion, precio: p.precio, categoriaId: p.categoriaId };
    this.errorMsg = '';
    this.mostrarModal = true;
  }

  cerrarModal(): void { this.mostrarModal = false; }

  guardar(): void {
    // Validaciones
    if (!this.form.codigo.trim()) {
      this.errorMsg = 'El código es obligatorio';
      return;
    }
    if (!this.form.nombre.trim()) {
      this.errorMsg = 'El nombre es obligatorio';
      return;
    }
    if (this.form.precio <= 0) {
      this.errorMsg = 'El precio debe ser mayor a 0';
      return;
    }
    if (!this.form.categoriaId) {
      this.errorMsg = 'Debe seleccionar una categoría';
      return;
    }

    this.errorMsg = '';

    if (this.modoEdicion) {
      this.productoService.editar(this.productoSeleccionado.id, this.form).subscribe({
        next: () => { this.cargarProductos(); this.cerrarModal(); },
        error: (err) => this.errorMsg = err.error?.mensaje || 'Error al guardar'
      });
    } else {
      this.productoService.crear(this.form).subscribe({
        next: () => { this.cargarProductos(); this.cerrarModal(); },
        error: (err) => this.errorMsg = err.error?.mensaje || 'Error al crear'
      });
    }
  }

  toggleEstado(p: any): void {
    this.productoService.cambiarEstado(p.id).subscribe({
      next: (resp) => p.activo = resp.activo,
      error: (err) => console.error(err)
    });
  }

  // Categorías
  abrirModalCategoria(cat?: any): void {
    this.categoriaEditandoId = cat ? cat.id : null;
    this.formCategoria = { nombre: cat ? cat.nombre : '' };
    this.mostrarModalCategoria = true;
  }

  cerrarModalCategoria(): void { this.mostrarModalCategoria = false; }

  guardarCategoria(): void {
    const obs = this.categoriaEditandoId
      ? this.categoriaService.editar(this.categoriaEditandoId, this.formCategoria)
      : this.categoriaService.crear(this.formCategoria);
    obs.subscribe({ next: () => { this.cargarCategorias(); this.cerrarModalCategoria(); }, error: (err) => console.error(err) });
  }

  irA(ruta: string): void { this.router.navigate([ruta]); }
}
