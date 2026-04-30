import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, switchMap, of, throwError } from 'rxjs';
import { environment } from '../../enviroments/enviroment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const http = inject(HttpClient);

  const reqConCookies = req.clone({ withCredentials: true });

  return next(reqConCookies).pipe(
    catchError((error: HttpErrorResponse) => {
      // Solo interceptar 401 y que no sea la propia petición de logout o login
      const esLogout = req.url.includes('/auth/logout');
      const esLogin  = req.url.includes('/auth/login');
      const esMe     = req.url.includes('/auth/me');

      if (error.status === 401 && !esLogout && !esLogin && !esMe) {
        // Llamar al logout para registrar la hora de salida
        return http.post(`${environment.apiUrl}/auth/logout`, {}, { withCredentials: true }).pipe(
          switchMap(() => {
            router.navigate(['/login'], { queryParams: { reason: 'expired' } });
            return of(null as any);
          }),
          catchError(() => {
            // Si el logout también falla, redirigir igual
            router.navigate(['/login'], { queryParams: { reason: 'expired' } });
            return of(null as any);
          })
        );
      }

      return throwError(() => error);
    })
  );
};
