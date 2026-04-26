import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';

@Injectable({ providedIn: 'root' })
export class IngresoService {
  private url = `${environment.apiUrl}/ingresos`;

  constructor(private http: HttpClient) {}

  registrar(data: any): Observable<any> {
    return this.http.post<any>(this.url, data);
  }

  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.url);
  }
}
