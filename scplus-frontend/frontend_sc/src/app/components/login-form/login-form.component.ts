import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxMaskDirective } from 'ngx-mask';
import { LoginDTO } from '../../dto/login/LoginDTO';
import { AuthService } from '../../services/auth.service';

/* Angular Material */
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatIconModule,
    MatSnackBarModule,
    NgxMaskDirective,
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent implements OnInit {
  loginForm!: FormGroup;
  hideSenha: boolean = true;
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService // Injetar o AuthService
  ) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      cpf: new FormControl('', [
        Validators.required,
        this.validateCpf.bind(this)
      ]),
      senha: new FormControl('', [
        Validators.required,
        Validators.minLength(6)
      ])
    });
  }

  validateCpf(control: FormControl): { [key: string]: any } | null {
    const cpf = control.value?.replace(/\D/g, '');
    
    if (!cpf) return null;

    if(cpf === '00000000000')
      return null;
    
    // Validação básica de CPF
    if (cpf.length !== 11) return { invalidCpf: true };
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) return { invalidCpf: true };
    
    // Validação dos dígitos verificadores
    let sum = 0;
    let remainder;
    
    for (let i = 1; i <= 9; i++) {
      sum = sum + parseInt(cpf.substring(i-1, i)) * (11 - i);
    }
    
    remainder = (sum * 10) % 11;
    
    if ((remainder === 10) || (remainder === 11)) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return { invalidCpf: true };
    
    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum = sum + parseInt(cpf.substring(i-1, i)) * (12 - i);
    }
    
    remainder = (sum * 10) % 11;
    
    if ((remainder === 10) || (remainder === 11)) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11))) return { invalidCpf: true };
    
    return null;
  }

  toggleSenha(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.hideSenha = !this.hideSenha;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      
      const loginData: LoginDTO = {
        cpf: this.loginForm.get('cpf')?.value.replace(/\D/g, ''),
        senha: this.loginForm.get('senha')?.value
      };

      this.authService.login(loginData).subscribe({
        next: (response) => {
          if (response.sucesso) {
            this.snackBar.open(response.mensagem || 'Login realizado com sucesso!', 'Fechar', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });

            // Redirecionar baseado no tipo de usuário
            this.redirectByUserType(response.dados.tipoUsuario);
          } else {
            this.snackBar.open(response.mensagem || 'Erro ao realizar login.', 'Fechar', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
          }
        },
        error: (error) => {
          this.snackBar.open(
            error.message || 'Erro ao realizar login. Verifique suas credenciais.',
            'Fechar',
            {
              duration: 5000,
              panelClass: ['error-snackbar']
            }
          );
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      this.snackBar.open('Por favor, preencha todos os campos corretamente.', 'Fechar', {
        duration: 3000,
        panelClass: ['warning-snackbar']
      });
    }
  }

  private redirectByUserType(tipoUsuario: 'Admin' | 'Instrutor' | 'Aluno'): void {
    switch (tipoUsuario) {
      case 'Admin':
        this.router.navigate(['/instrutor']);
        break;
      case 'Instrutor':
        this.router.navigate(['/instrutor']);
        break;
      case 'Aluno':
        this.router.navigate(['/dashboard']);
        break;
      default:
        this.router.navigate(['/']);
    }
  }

  onForgotPassword(): void {
    // Implementar funcionalidade de esqueci minha senha
    this.snackBar.open('Funcionalidade em desenvolvimento', 'Fechar', {
      duration: 3000
    });
  }
}