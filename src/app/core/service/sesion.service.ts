import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';

@Injectable({ providedIn: 'root' })
export class SesionService {
  private url = `${environment.apiUrl}/sesiones`;

  constructor(private http: HttpClient) {}

  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.url);
  }
}
