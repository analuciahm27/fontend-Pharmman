import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private url = `${environment.apiUrl}/categorias`;

  constructor(private http: HttpClient) {}

  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.url);
  }

  crear(data: { nombre: string; prefijo?: string }): Observable<any> {
    return this.http.post<any>(this.url, data);
  }

  editar(id: number, data: { nombre: string; prefijo?: string }): Observable<any> {
    return this.http.put<any>(`${this.url}/${id}`, data);
  }
}
