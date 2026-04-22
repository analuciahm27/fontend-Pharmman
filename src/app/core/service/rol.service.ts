import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';


@Injectable({ providedIn: 'root' })
export class RolService {

  private url = `${environment.apiUrl}/roles`;

  constructor(private http: HttpClient) {}

  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.url, { withCredentials: true });
  }

  crear(data: any): Observable<any> {
    return this.http.post(this.url, data, { withCredentials: true });
  }

  listarModulos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/modulos`, { withCredentials: true });
  }

  getPermisosPorRol(rolId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/${rolId}/permisos`, { withCredentials: true });
  }

  actualizarPermiso(data: any): Observable<any> {
    return this.http.put(`${this.url}/permisos`, data, { withCredentials: true });
  }
}