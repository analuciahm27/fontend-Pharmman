import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sesion } from '../model/sesion';

@Injectable({
  providedIn: 'root'
})
export class SesionService {
  private apiUrl = 'http://localhost:8080/api/sesiones';

  constructor(private http: HttpClient) { }

  listarTodas(): Observable<Sesion[]> {
    return this.http.get<Sesion[]>(this.apiUrl);
  }

  // Se llama al hacer login
  registrarEntrada(usuarioId: number): Observable<Sesion> {
    return this.http.post<Sesion>(`${this.apiUrl}/entrada`, { usuarioId });
  }

  // Se llama al hacer logout
  registrarSalida(sesionId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/salida/${sesionId}`, {});
  }
}