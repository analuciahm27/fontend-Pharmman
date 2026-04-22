import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../core/service/usuario.service';
import { RolService } from '../../core/service/rol.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit {

  // --- USUARIOS ---
  listaUsuarios: any[] = [];
  mostrarModalUsuario = false;
  modoEdicion = false;
  usuarioSeleccionado: any = null;

  form: {
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    email: string;
    password: string;
    rolId: number | null;
  } = {
    nombre: '', apellidoPaterno: '', apellidoMaterno: '',
    email: '', password: '', rolId: null
  };

  // --- ROLES ---
  listaRoles: any[] = [];
  listaModulos: any[] = [];
  mostrarModalRol = false;
  modoEdicionRol = false;
  rolSeleccionado: any = null;
  permisosRol: any[] = [];
  mostrarModalPermisos = false;

  formRol = { nombre: '', descripcion: '' };

  constructor(
    private router: Router,
    private usuarioService: UsuarioService,
    private rolService: RolService
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
    this.cargarRoles();
    this.cargarModulos();
  }

  // ==================== USUARIOS ====================

  cargarUsuarios(): void {
    this.usuarioService.listar().subscribe({
      next: (data) => this.listaUsuarios = data,
      error: (err) => console.error(err)
    });
  }

  abrirModalCrear(): void {
    this.modoEdicion = false;
    this.form = { nombre: '', apellidoPaterno: '', apellidoMaterno: '', email: '', password: '', rolId: null };
    this.mostrarModalUsuario = true;
  }

  abrirModalEditar(user: any): void {
    this.modoEdicion = true;
    this.usuarioSeleccionado = user;
    const rolEncontrado = this.listaRoles.find(r => r.nombre === user.rol);
    this.form = {
      nombre: user.nombre,
      apellidoPaterno: user.apellidoPaterno,
      apellidoMaterno: user.apellidoMaterno,
      email: user.email,
      password: '',
      rolId: rolEncontrado ? rolEncontrado.id : null
    };
    this.mostrarModalUsuario = true;
  }

  cerrarModalUsuario(): void {
    this.mostrarModalUsuario = false;
    this.usuarioSeleccionado = null;
  }

  guardar(): void {
    if (this.modoEdicion) {
      this.usuarioService.editar(this.usuarioSeleccionado.id, this.form).subscribe({
        next: () => { this.cargarUsuarios(); this.cerrarModalUsuario(); },
        error: (err) => console.error(err)
      });
    } else {
      this.usuarioService.crear(this.form).subscribe({
        next: () => { this.cargarUsuarios(); this.cerrarModalUsuario(); },
        error: (err) => console.error(err)
      });
    }
  }

  toggleEstado(user: any): void {
    this.usuarioService.cambiarEstado(user.id).subscribe({
      next: (resp) => user.estado = resp.estado,
      error: (err) => console.error(err)
    });
  }

  // ==================== ROLES ====================

  cargarRoles(): void {
    this.rolService.listar().subscribe({
      next: (data) => this.listaRoles = data,
      error: (err) => console.error(err)
    });
  }

  cargarModulos(): void {
    this.rolService.listarModulos().subscribe({
      next: (data) => this.listaModulos = data,
      error: (err) => console.error(err)
    });
  }

  abrirModalCrearRol(): void {
    this.modoEdicionRol = false;
    this.formRol = { nombre: '', descripcion: '' };
    this.mostrarModalRol = true;
  }

  cerrarModalRol(): void {
    this.mostrarModalRol = false;
  }

  guardarRol(): void {
    this.rolService.crear(this.formRol).subscribe({
      next: () => { this.cargarRoles(); this.cerrarModalRol(); },
      error: (err) => console.error(err)
    });
  }

  abrirPermisos(rol: any): void {
    this.rolSeleccionado = rol;
    this.rolService.getPermisosPorRol(rol.id).subscribe({
      next: (permisos) => {
        // combina módulos con permisos existentes
        this.permisosRol = this.listaModulos.map(modulo => {
          const permisoExistente = permisos.find((p: any) => p.modulo === modulo.nombre);
          return {
            moduloId: modulo.id,
            modulo: modulo.nombre,
            lectura: permisoExistente?.lectura ?? false,
            escritura: permisoExistente?.escritura ?? false
          };
        });
        this.mostrarModalPermisos = true;
      },
      error: (err) => console.error(err)
    });
  }

  cerrarModalPermisos(): void {
    this.mostrarModalPermisos = false;
    this.rolSeleccionado = null;
  }

  guardarPermiso(permiso: any): void {
    this.rolService.actualizarPermiso({
      rolId: this.rolSeleccionado.id,
      moduloId: permiso.moduloId,
      lectura: permiso.lectura,
      escritura: permiso.escritura
    }).subscribe({
      error: (err) => console.error(err)
    });
  }

  irA(ruta: string): void {
    this.router.navigate([ruta]);
  }
}