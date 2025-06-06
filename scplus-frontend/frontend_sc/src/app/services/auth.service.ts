import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, throwError, timer } from 'rxjs';
import { Router } from '@angular/router';
import { LoginDTO } from '../dto/login/LoginDTO';
import { LoginResponse } from '../dto/login/LoginResponseDTO';
import { catchError, tap, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.ApiUrl}/auth`; // URL da API

  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private tokenCheckInterval: any;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Verificar se há usuário logado no localStorage
    const storedUser = localStorage.getItem('usuario');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
      this.startTokenValidation();
    }
  }

  login(loginData: LoginDTO): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, loginData)
      .pipe(
        tap(response => {
          if (response.sucesso && response.dados) {
            localStorage.setItem('token', response.dados.token);
            localStorage.setItem('usuario', JSON.stringify(response.dados));
            this.currentUserSubject.next(response.dados);
            this.startTokenValidation();
          }
        }),
        catchError(error => {
          console.error('Erro no login:', error);
          let errorMessage = 'Erro ao realizar login. Verifique suas credenciais.';
          
          if (error.error && error.error.mensagem) {
            errorMessage = error.error.mensagem;
          } else if (error.status === 401) {
            errorMessage = 'CPF ou senha inválidos.';
          } else if (error.status === 0) {
            errorMessage = 'Erro de conexão com o servidor.';
          }
          
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  // Verificar token periodicamente
  private startTokenValidation(): void {
    if (this.tokenCheckInterval) {
      clearInterval(this.tokenCheckInterval);
    }

    // Verificar token a cada 5 minutos
    this.tokenCheckInterval = setInterval(() => {
      if (!this.isAuthenticated()) {
        this.logout();
      }
    }, 5 * 60 * 1000);
  }

  logout(): void {

    if (this.tokenCheckInterval) {
      clearInterval(this.tokenCheckInterval);
    }
    
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.currentUserSubject.next(null);
    
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): Observable<boolean> {
    const token = this.getToken();
    if (!token) {
      return of(false);
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      const isValid = payload.exp > currentTime;
      
      if (!isValid) {
        this.logout();
      }
      
      return of(isValid);
    } catch {
      this.logout();
      return of(false);
    }
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime;
    } catch {
      return false;
    }
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  getUserType(): 'Admin' | 'Instrutor' | 'Aluno' | null {
    const user = this.getCurrentUser();
    return user ? user.tipoUsuario : null;
  }

  hasPermission(requiredRole: 'Admin' | 'Instrutor' | 'Aluno'): boolean {
    if (!this.isAuthenticated()) {
      return false;
    }

    const userType = this.getUserType();
    if (!userType) return false;

    // Admin tem acesso a tudo
    if (userType === 'Admin') return true;

    // Instrutor pode acessar suas próprias funcionalidades e de aluno
    if (userType === 'Instrutor' && (requiredRole === 'Instrutor' || requiredRole === 'Aluno')) {
      return true;
    }

    // Aluno só pode acessar suas próprias funcionalidades
    if (userType === 'Aluno' && requiredRole === 'Aluno') {
      return true;
    }

    return false;
  }

  // Método para verificar se o usuário pode acessar uma rota específica
  canAccessRoute(route: string): boolean {
    if (!this.isAuthenticated()) {
      return false;
    }

    const userType = this.getUserType();
    
    // Definir regras de acesso por rota
    const routePermissions: { [key: string]: string[] } = {
      '/instrutor': ['Admin'],
      '/aluno': ['Admin', 'Instrutor'],
      '/matricula': ['Admin'],
      '/veiculo': ['Admin', 'Instrutor'],
      '/aula': ['Admin', 'Instrutor'],
      '/': ['Admin', 'Instrutor', 'Aluno'],
    };

    const allowedRoles = routePermissions[route];
    if (!allowedRoles) {
      return true; // Se não há restrições específicas, permitir acesso
    }

    return allowedRoles.includes(userType || '');
  }
}