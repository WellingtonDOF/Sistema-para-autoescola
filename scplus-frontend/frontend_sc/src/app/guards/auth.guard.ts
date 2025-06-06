import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core'; 
import { AuthService } from '../services/auth.service'; 
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);         

  if (state.url === '/login' || state.url === '/') {
    return true;
  }

  return authService.isLoggedIn().pipe(
    take(1),
    map(isLoggedIn => {
      if (isLoggedIn) {
        return true; // Permitir acesso
      } else {
        // Se o token expirou, fazer logout e redirecionar
        authService.logout();
        return router.createUrlTree(['/login']);
      }
    })
  );
};