import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment'; // Ojo con la ruta del archivo

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private readonly URL = `${environment.apiUrl}/usuarios`;

  constructor(private http: HttpClient) {}

  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.URL);
  }

  cambiarEstado(id: number): Observable<any> {
    return this.http.patch(`${this.URL}/${id}/estado`, {});
  }

  crear(usuario: any): Observable<any> {
    return this.http.post(this.URL, usuario);
  }

  editar(id: number, data: any): Observable<any> {
  return this.http.put(`${this.URL}/${id}`, data, { withCredentials: true });
}
}