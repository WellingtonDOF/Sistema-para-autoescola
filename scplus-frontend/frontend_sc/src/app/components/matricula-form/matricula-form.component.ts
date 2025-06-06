import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { format, getDayOfYear } from 'date-fns';
import { NgxMaskDirective } from 'ngx-mask';
import { HttpClient } from '@angular/common/http';
import { catchError, debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { MatriculaCreateDTO } from '../../dto/matricula/MatriculaCreateDTO';
import { MatriculaUpdateDTO } from '../../dto/matricula/MatriculaUpdateDTO';
import { MatriculaViewModel } from '../../models/MatriculaViewModel';
import { MatriculaService } from '../../services/matricula.service';
import { TelefoneService } from '../../services/telefone.service';

/* Angular Material */
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-matricula-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    NgxMaskDirective,
  ],
  templateUrl: './matricula-form.component.html',
  styleUrl: './matricula-form.component.css'
})

export class MatriculaFormComponent implements OnInit {

  @Output() onSubmit = new EventEmitter<MatriculaCreateDTO>();
  @Output() onSubmitUpdate = new EventEmitter<MatriculaUpdateDTO>();

  @Input() btnAcao!: string;
  @Input() btnTitulo!: string;
  @Input() dadosMatricula: MatriculaViewModel | null = null;
  @Input() exibirDadosAluno: boolean = false;

  matriculaForm!: FormGroup;
  id: number | null = null; 

  constructor(private route: ActivatedRoute, private http: HttpClient, private matriculaService: MatriculaService, private telefoneService: TelefoneService) { }

  ngOnInit(): void {
    const formControls: any = {
      id: new FormControl(this.dadosMatricula ? this.dadosMatricula.id : 0),
      alunoId: new FormControl(null),
      categoriaPlano: new FormControl(this.dadosMatricula?.categoriaPlano || '', [
        Validators.required,
      ]),
      quantidadeAulaTotal: new FormControl(this.dadosMatricula ? this.dadosMatricula.quantidadeAulaTotal : 0, [
        Validators.required,
        Validators.min(1)
      ]),
    };

    if (!this.dadosMatricula) {
      formControls.cpf = new FormControl('', {
        validators: [Validators.required, this.validateCpf.bind(this)],
        asyncValidators: [(control: AbstractControl) => this.validateCpfExists(control)]
      });

      formControls.nomeCompleto = new FormControl({value: '', disabled: true});
      formControls.email = new FormControl({value: '', disabled: true}); 
      formControls.telefone = new FormControl({value: '', disabled: true});
    }
  

    this.matriculaForm = new FormGroup(formControls);

    this.route.params.subscribe(params => {
      this.id = +params['id'];
      if (this.id && this.dadosMatricula) {
        this.matriculaForm.removeControl('cpf');
        this.matriculaForm.removeControl('id');
        this.matriculaForm.removeControl('alunoId');
      }

      this.matriculaForm.get('cpf')?.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.matriculaForm.get('cpf')?.updateValueAndValidity();
      });
      
    });
  }

  toggleExibirDadosAluno(): void {
    this.exibirDadosAluno = !this.exibirDadosAluno;
  }

  inserirDadosAlunoMatricula(response: any) {
    if (response!=null) {
        this.matriculaForm.get('alunoId')?.setValue(response.id);
        this.matriculaForm.get('nomeCompleto')?.setValue(response.nomeCompleto);
        this.matriculaForm.get('email')?.setValue(response.email);
        this.matriculaForm.get('telefone')?.setValue(this.telefoneService.formatarTelefone(response.telefone));
        this.exibirDadosAluno = true;
    } else {
        this.matriculaForm.get('alunoId')?.setValue('');
        this.matriculaForm.get('nomeCompleto')?.setValue('');
        this.matriculaForm.get('email')?.setValue('');
        this.matriculaForm.get('telefone')?.setValue('');
        this.exibirDadosAluno = false; 
    }
  }

  validateCpfExists(control: AbstractControl): Observable<ValidationErrors | null> {
    if (!control.value || this.dadosMatricula) {
      return of(null);
    }
  
    const cpfNumeros = control.value.replace(/\D/g, '');
    
    return this.matriculaService.VerificarCpfExistente(cpfNumeros).pipe(
      map(response => {
        // Caso de sucesso (CPF válido e sem matrícula)
        console.log('Resposta da API:', response);
        this.inserirDadosAlunoMatricula(response.dados);

        if (response.sucesso && response.dados!= null) {
          console.log('teste')
          return null;
        }
        // CPF existe mas já tem matrícula
        else if (response.mensagem.includes('Usuário já possui matrícula ativa.')) {
          return { matriculaExists: true };
        }
        else if(response.mensagem.includes('CPF cadastrado, mas não corresponde a um Aluno.')){
          return { isNotAluno: true };
        }
        // CPF não existe
        else if(response.mensagem.includes('CPF não cadastrado.')){
            return { cpfNotExists: true };
        }else{
          // Erro genérico
          return { cpfError: true };
        }
        //}
      }),
      catchError(() => {
        return of({ cpfError: true });
      })
    );
  }

  validateCpf(control: FormControl): { [key: string]: any } | null {
    const cpf = control.value?.replace(/\D/g, '');
    
    if (!cpf) return null;
    
    // Validação básica de CPF
    if (cpf.length !== 11){
      this.inserirDadosAlunoMatricula(null);
      return {
        invalidCpf: true
      };
    }

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

  submit() {
    if (this.matriculaForm.valid) {
      // Prepara os dados para envio
      const formData = {
        alunoId: Number(this.matriculaForm.get('alunoId')?.value),
        categoriaPlano: (this.matriculaForm.get('categoriaPlano')?.value),
        quantidadeAulaTotal: Number(this.matriculaForm.get('quantidadeAulaTotal')?.value)
      };
  
      console.log('Dados formatados para API:', formData);
  
      if (this.dadosMatricula) {
        this.onSubmitUpdate.emit(formData);
      } else {
        this.onSubmit.emit(formData);
      }
    } else {
      console.log('Formulário inválido:', this.matriculaForm.errors);
    }
  }
  
}