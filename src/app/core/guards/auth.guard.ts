import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verificamos si el BehaviorSubject tiene al usuario
  if (authService.isLoggedIn()) { 
    return true;
  }

  // Si no hay usuario, directo al login
  return router.createUrlTree(['/login']);
};