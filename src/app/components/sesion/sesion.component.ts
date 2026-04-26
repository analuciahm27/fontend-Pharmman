import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SesionService } from '../../core/service/sesion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sesion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sesion.component.html',
  styleUrls: ['./sesion.component.css']
})
export class SesionesComponent implements OnInit {

  sesiones: any[] = [];
  sesionesFiltradas: any[] = [];
  filtroUsuario = '';
  filtroDesde = '';
  filtroHasta = '';

  constructor(private sesionService: SesionService, private router: Router) {}

  ngOnInit(): void { this.cargarSesiones(); }

  cargarSesiones(): void {
    this.sesionService.listar().subscribe({
      next: (data) => { this.sesiones = data; this.sesionesFiltradas = data; },
      error: (err) => console.error(err)
    });
  }

  filtrar(): void {
    this.sesionesFiltradas = this.sesiones.filter(s => {
      const matchUsuario = !this.filtroUsuario ||
        s.usuarioNombre.toLowerCase().includes(this.filtroUsuario.toLowerCase()) ||
        s.usuarioEmail.toLowerCase().includes(this.filtroUsuario.toLowerCase());
      const entrada = new Date(s.entrada);
      const matchDesde = !this.filtroDesde || entrada >= new Date(this.filtroDesde);
      const matchHasta = !this.filtroHasta || entrada <= new Date(this.filtroHasta + 'T23:59:59');
      return matchUsuario && matchDesde && matchHasta;
    });
  }

  limpiarFiltros(): void {
    this.filtroUsuario = '';
    this.filtroDesde = '';
    this.filtroHasta = '';
    this.sesionesFiltradas = this.sesiones;
  }

  irA(ruta: string): void { this.router.navigate([ruta]); }
}
