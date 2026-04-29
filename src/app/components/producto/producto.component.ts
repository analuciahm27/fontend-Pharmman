import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductoService } from '../../core/service/producto.service';
import { CategoriaService } from '../../core/service/categoria.service';
import { AuthService } from '../../core/service/auth.service';
import { mensajeError } from '../../core/utils/http-error.util';

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
  puedeEscribir = false;
  sinPermiso = false;

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
    this.puedeEscribir = this.esAdmin || this.authService.tienePermiso('Productos_escritura');
    if (!this.authService.tienePermiso('Productos_lectura') && !this.esAdmin) {
      this.sinPermiso = true;
      return;
    }
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
      if (!confirm(`¿Guardar los cambios del producto "${this.form.nombre}"?`)) return;
      this.productoService.editar(this.productoSeleccionado.id, { ...this.form, codigo: this.form.codigo.toUpperCase() }).subscribe({
        next: () => { this.cargarProductos(); this.cerrarModal(); },
        error: (err) => this.errorMsg = mensajeError(err)
      });
    } else {
      this.productoService.crear({ ...this.form, codigo: this.form.codigo.toUpperCase() }).subscribe({
        next: () => { this.cargarProductos(); this.cerrarModal(); },
        error: (err) => this.errorMsg = mensajeError(err)
      });
    }
  }

  toggleEstado(p: any): void {
    const accion = p.activo ? 'desactivar' : 'activar';
    if (!confirm(`¿Estás seguro de que deseas ${accion} el producto "${p.nombre}"?`)) return;
    this.productoService.cambiarEstado(p.id).subscribe({
      next: (resp) => p.activo = resp.activo,
      error: (err) => this.errorMsg = mensajeError(err)
    });
  }

  errorCategoria = '';

  // Categorías
  abrirModalCategoria(cat?: any): void {
    this.categoriaEditandoId = cat ? cat.id : null;
    this.formCategoria = { nombre: cat ? cat.nombre : '' };
    this.errorCategoria = '';
    this.mostrarModalCategoria = true;
  }

  cerrarModalCategoria(): void {
    this.mostrarModalCategoria = false;
    this.errorCategoria = '';
  }

  guardarCategoria(): void {
    if (!this.formCategoria.nombre.trim()) {
      this.errorCategoria = 'El nombre de la categoría es obligatorio';
      return;
    }
    const nombreExiste = this.categorias.some(c =>
      c.nombre.toLowerCase() === this.formCategoria.nombre.trim().toLowerCase() &&
      c.id !== this.categoriaEditandoId
    );
    if (nombreExiste) {
      this.errorCategoria = 'Ya existe una categoría con ese nombre';
      return;
    }
    const obs = this.categoriaEditandoId
      ? this.categoriaService.editar(this.categoriaEditandoId, this.formCategoria)
      : this.categoriaService.crear(this.formCategoria);
    obs.subscribe({
      next: () => { this.cargarCategorias(); this.cerrarModalCategoria(); },
      error: (err) => this.errorCategoria = mensajeError(err)
    });
  }

  irA(ruta: string): void { this.router.navigate([ruta]); }
}
