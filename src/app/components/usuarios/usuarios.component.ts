import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../core/service/usuario.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit {

  listaUsuarios: any[] = [];
  mostrarModal = false;
  modoEdicion = false;
  usuarioSeleccionado: any = null;

  form = {
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    email: '',
    password: '',
    rolId: null as number | null,
  };

  roles = [
    { id: 1, nombre: 'ADMIN' },
    { id: 2, nombre: 'VENDEDOR' }
  ];

  constructor(
    private router: Router,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.usuarioService.listar().subscribe({
      next: (data) => this.listaUsuarios = data,
      error: (err) => console.error('Error al traer usuarios', err)
    });
  }

  abrirModalCrear(): void {
    this.modoEdicion = false;
    this.form = { nombre: '', apellidoPaterno: '', apellidoMaterno: '', email: '', password: '', rolId: null };
    this.mostrarModal = true;
  }

  abrirModalEditar(user: any): void {
    this.modoEdicion = true;
    this.usuarioSeleccionado = user;
    const rolEncontrado = this.roles.find(r => r.nombre === user.rol);
    this.form = {
      nombre: user.nombre,
      apellidoPaterno: user.apellidoPaterno,
      apellidoMaterno: user.apellidoMaterno,
      email: user.email,
      password: '',
      rolId: rolEncontrado ? rolEncontrado.id : null // 👈 mapea nombre → id
    };
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.usuarioSeleccionado = null;
  }

  guardar(): void {
    if (this.modoEdicion) {
      this.usuarioService.editar(this.usuarioSeleccionado.id, this.form).subscribe({
        next: () => { this.cargarUsuarios(); this.cerrarModal(); },
        error: (err) => console.error('Error al editar', err)
      });
    } else {
      this.usuarioService.crear(this.form).subscribe({
        next: () => { this.cargarUsuarios(); this.cerrarModal(); },
        error: (err) => console.error('Error al crear', err)
      });
    }
  }

  toggleEstado(user: any): void {
    this.usuarioService.cambiarEstado(user.id).subscribe({
      next: (resp) => user.estado = resp.estado,
      error: (err) => console.error('Error al cambiar estado', err)
    });
  }

  irA(ruta: string): void {
    this.router.navigate([ruta]);
  }
}