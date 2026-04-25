import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SesionService } from '../../core/service/sesion.service';
import { Sesion } from '../../core/model/sesion';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sesion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sesion.component.html',
  styleUrls: ['./sesion.component.css']
})
export class SesionesComponent implements OnInit {
  sesiones: Sesion[] = [];

  constructor(private sesionService: SesionService, private router: Router) {}

  ngOnInit(): void {
    this.cargarSesiones();
  }

  cargarSesiones() {
    this.sesionService.listarTodas().subscribe(data => {
      this.sesiones = data;
    });
  }

  regresar() {
    this.router.navigate(['/dashboard']);
  }
}