import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);
  
  const token = authService.getToken();

  // Adicionar token se existir
  let authReq = req;
  if (token) {
    authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Token inválido ou expirado
        snackBar.open('Sessão expirada. Faça login novamente.', 'Fechar', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        authService.logout();
      } else if (error.status === 403) {
        // Acesso negado
        snackBar.open('Você não tem permissão para acessar este recurso.', 'Fechar', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        router.navigate(['/login']);
      } else if (error.status === 0) {
        // Erro de conexão
        snackBar.open('Erro de conexão com o servidor.', 'Fechar', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }

      return throwError(() => error);
    })
  );
};