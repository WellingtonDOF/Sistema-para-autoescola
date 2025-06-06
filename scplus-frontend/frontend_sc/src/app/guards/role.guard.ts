import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { map, take, tap } from 'rxjs/operators';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  return authService.isLoggedIn().pipe(
    take(1),
    map(isLoggedIn => {
      if (!isLoggedIn) {
        return router.createUrlTree(['/login']);
      }

      const requiredRoles = route.data['roles'] as Array<string>;
      const userType = authService.getUserType();

      if (!requiredRoles || requiredRoles.length === 0) {
        return true; // Se não há roles específicos, apenas precisa estar logado
      }

      if (!userType) {
        return router.createUrlTree(['/login']);
      }

      // Verificar se o usuário tem permissão
      const hasPermission = requiredRoles.some(role => 
        authService.hasPermission(role as 'Admin' | 'Instrutor' | 'Aluno')
      );

      if (hasPermission) {
        return true;
      } else {
        // Mostrar mensagem de erro
        notificationService.showAccessDenied();
        
        // Redirecionar para página apropriada baseada no tipo de usuário
        switch (userType) {
          case 'Admin':
            return router.createUrlTree(['/dashboard']);
          case 'Instrutor':
            return router.createUrlTree(['/dashboard']);
          case 'Aluno':
            return router.createUrlTree(['/dashboard']);
          default:
            return router.createUrlTree(['/login']);
        }
      }
    })
  );
};