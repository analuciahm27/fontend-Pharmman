import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // adjunta las cookies automáticamente en cada petición
  const reqConCookies = req.clone({
    withCredentials: true
  });
  return next(reqConCookies);
};