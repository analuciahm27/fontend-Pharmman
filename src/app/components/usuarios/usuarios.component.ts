import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { UsuarioService } from '../../core/service/usuario.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit {
  listaUsuarios: any[] = [];

  constructor(
    private router: Router,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.usuarioService.listar().subscribe({
      next: (data) => {
        this.listaUsuarios = data; 
      },
      error: (err) => console.error('Error al traer usuarios', err)
    });
  }

  toggleEstado(user: any): void {
    this.usuarioService.cambiarEstado(user.id).subscribe({
      next: () => {
        user.activo = !user.activo; 
      }
    });
  }

  irA(ruta: string): void {
    this.router.navigate([ruta]);
  }
}