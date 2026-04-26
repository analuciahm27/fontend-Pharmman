import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../model/producto';
import { environment } from '../../../enviroments/enviroment';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private url = `${environment.apiUrl}/productos`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.url);
  }

  buscar(termino: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.url}/buscar`, { params: { termino } });
  }

  crear(data: any): Observable<Producto> {
    return this.http.post<Producto>(this.url, data);
  }

  editar(id: number, data: any): Observable<Producto> {
    return this.http.put<Producto>(`${this.url}/${id}`, data);
  }

  cambiarEstado(id: number): Observable<Producto> {
    return this.http.patch<Producto>(`${this.url}/${id}/estado`, {});
  }
}
