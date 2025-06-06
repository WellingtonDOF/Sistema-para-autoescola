import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { AlunoCreateDTO } from '../../dto/aluno/AlunoCreateDTO';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AlunoViewModel } from '../../models/AlunoViewModel';
import { format, getDayOfYear } from 'date-fns';
import { AlunoUpdateDTO } from '../../dto/aluno/AlunoUpdateDTO';
import { NgxMaskDirective } from 'ngx-mask';
import { HttpClient } from '@angular/common/http';
import { catchError, debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { AlunoService } from '../../services/aluno.service';
import { InstrutorCreateDTO } from '../../dto/instrutor/InstrutorCreateDTO';
import { InstrutorViewModel } from '../../models/InstrutorViewModel';
import { InstrutorUpdateDTO } from '../../dto/instrutor/InstrutorUpdateDTO';

/* Angular Material */
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-aluno-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatInputModule, 
    MatSelectModule,
    MatIconModule, 
    NgxMaskDirective,
  ],
  templateUrl: './aluno-form.component.html',
  styleUrl: './aluno-form.component.css',
})

export class AlunoFormComponent implements OnInit {

  //@Output() onSubmit = new EventEmitter<AlunoCreateDTO>();
  //@Output() onSubmitUpdate = new EventEmitter<AlunoUpdateDTO>();

  @Output() onSubmit = new EventEmitter<AlunoCreateDTO | InstrutorCreateDTO>();
  //@Output() onSubmitUpdate = new EventEmitter<AlunoUpdateDTO>();
  @Output() onSubmitUpdate = new EventEmitter<AlunoUpdateDTO | InstrutorUpdateDTO>();


  @Input() btnAcao!: string;
  @Input() btnTitulo!: string;
  @Input() dadosAluno: AlunoViewModel | InstrutorViewModel | null = null;
  @Input() tipoCadastro!: 'aluno' | 'instrutor'; // Novo Input

  alunoForm!: FormGroup;
  id: number | null = null;
  hideSenha: boolean = true;
  hideConfirmarSenha: boolean = true;

  constructor(private route: ActivatedRoute, private http: HttpClient, private alunoService: AlunoService) { }

  ngOnInit(): void {
    let dataNascimento = '';
    if (this.dadosAluno?.dataNascimento) {
      dataNascimento = format(new Date(this.dadosAluno.dataNascimento), 'yyyy-MM-dd');
    }

    let telefoneFormatado = '';
    if (this.dadosAluno?.telefone) {
      const telefoneNumeros = this.dadosAluno.telefone.replace(/\D/g, '');
      if (telefoneNumeros.length === 10) { // DDD + 8 dígitos
        telefoneFormatado = `(${telefoneNumeros.substring(0, 2)}) ${telefoneNumeros.substring(2, 6)}-${telefoneNumeros.substring(6, 10)}`;
      } else if (telefoneNumeros.length === 11) { // DDD + 9 dígitos
        telefoneFormatado = `(${telefoneNumeros.substring(0, 2)}) ${telefoneNumeros.substring(2, 7)}-${telefoneNumeros.substring(7, 11)}`;
      } else {
        telefoneFormatado = this.dadosAluno.telefone; // Se não corresponder, usa o valor original
      }
    }
      
    // 1. Campos COMUNS a todos
    const formControls: any = {
      id: new FormControl(this.dadosAluno ? this.dadosAluno.id : 0),
      nomeCompleto: new FormControl(this.dadosAluno?.nomeCompleto || '', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]),
      endereco: new FormControl(this.dadosAluno?.endereco || '', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(200)
      ]),
      telefone: new FormControl(telefoneFormatado, [
        Validators.required,
        Validators.pattern(/^\(\d{2}\) \d{4,5}-\d{4}$/)
      ]),
      email: new FormControl(this.dadosAluno?.email || '', [
        Validators.required,
        Validators.email
      ]),
      senha: new FormControl('', [
        this.dadosAluno ? Validators.nullValidator : Validators.required,
        Validators.minLength(6)
      ]),
    };

    // 2. Campos para NOVO CADASTRO (não edição)
    if (!this.dadosAluno) {
      formControls.cpf = new FormControl('', {
        validators: [Validators.required, this.validateCpf.bind(this)],
        asyncValidators: [(control: AbstractControl) => this.validateCpfExists(control)]
      });

      formControls.dataNascimento = new FormControl(dataNascimento, [
        Validators.required,
        this.validateAge
      ]);

      formControls.tipoUsuario = new FormControl('Aluno', [Validators.required]);
    }

    // 3. Campos ESPECÍFICOS para ALUNO
    if (this.tipoCadastro === 'aluno') {
      formControls.observacao = new FormControl(
        (this.dadosAluno as AlunoViewModel)?.observacao || '',
        [Validators.maxLength(500)] //Validators.required,
      );
    }

    // 4. Campos ESPECÍFICOS para INSTRUTOR
    if (this.tipoCadastro === 'instrutor') {
      const dataAdmissao = this.dadosAluno && 'dataAdmissao' in this.dadosAluno
        ? format(new Date((this.dadosAluno as InstrutorViewModel).dataAdmissao), 'yyyy-MM-dd')
        : '';

      formControls.dataAdmissao = new FormControl(dataAdmissao, [Validators.required, this.validateDataAdmissao]);
      formControls.categoriaCnh = new FormControl(
        (this.dadosAluno as InstrutorViewModel)?.categoriaCnh || '', 
        [Validators.required]
      );
    }

    if (this.tipoCadastro === 'instrutor') {
      formControls.categoriaCnh = new FormControl(
        this.dadosAluno && 'categoriaCnh' in this.dadosAluno 
          ? (this.dadosAluno as InstrutorViewModel).categoriaCnh 
          : '', 
        [Validators.required]
      );
    }

     formControls.confirmaSenha = new FormControl('', [
      this.dadosAluno ? Validators.nullValidator : Validators.required, // <--- ALTERAÇÃO AQUI!
      Validators.minLength(6),
      // O validador matchPasswords é aplicado no FormGroup, então não precisa aqui
    ]);

    // Cria o FormGroup com todos os controles
    this.alunoForm = new FormGroup(formControls, {
      validators: this.matchPasswords,
    });

    console.log(this.alunoForm.validator); // Deve **não ser null** se o validador foi atribuído corretamente
    this.route.params.subscribe(params => {
      this.id = +params['id'];
      if (this.id && this.dadosAluno) {
        this.alunoForm.removeControl('cpf');
        this.alunoForm.removeControl('dataNascimento');
        this.alunoForm.removeControl('tipoUsuario');
        this.alunoForm.removeControl('id');
      }

      this.alunoForm.get('cpf')?.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.alunoForm.get('cpf')?.updateValueAndValidity();
      });
    });

    this.alunoForm.get('telefone')?.valueChanges.subscribe(value => {
      if (this.alunoForm.get('telefone')?.valid) {
        const telefoneApenasNumeros = value ? value.replace(/\D/g, '') : '';
      }
    });
  }

matchPasswords(group: AbstractControl): ValidationErrors | null {
  const senhaControl = group.get('senha');
  const confirmaSenhaControl = group.get('confirmaSenha');

  const senha = senhaControl?.value;
  const confirmaSenha = confirmaSenhaControl?.value;

  if ((!senha && !confirmaSenha) ||
      (senhaControl?.hasError('required') && !confirmaSenha) ||
      (confirmaSenhaControl?.hasError('required') && !senha) ) { 
    return null; 
  }

  if (senha !== confirmaSenha) {
    confirmaSenhaControl?.setErrors({ senhasDiferentes: true });
    return { senhasDiferentes: true };
  } else {
    if (confirmaSenhaControl?.hasError('senhasDiferentes')) {
        const errors = confirmaSenhaControl.errors;
        if (errors) {
            delete errors['senhasDiferentes'];
            confirmaSenhaControl.setErrors(Object.keys(errors).length ? errors : null);
        }
    }
    return null; 
  }
}
  
  toggleSenha(event: Event, campo: 'senha' | 'confirmar'): void {
    event.preventDefault(); // Garante que não cause submit ou outros efeitos
    event.stopPropagation(); // Evita que a ação dispare nos elementos pai

    if(campo ==='senha'){
      this.hideSenha = !this.hideSenha;
    }
    else
        this.hideConfirmarSenha = !this.hideConfirmarSenha;
  }

  validateCpfExists(control: AbstractControl): Observable<ValidationErrors | null> {
    if (!control.value || this.dadosAluno) {
      return of(null);
    }
  
    const cpfNumeros = control.value.replace(/\D/g, '');
    
    return this.alunoService.VerificarCpfExistente(cpfNumeros).pipe(
      map(response => {
        return response.dados ? { cpfExists: true } : null;
      }),
      catchError(() => of(null))
    );
  }

  validateCpf(control: FormControl): { [key: string]: any } | null {
    const cpf = control.value?.replace(/\D/g, '');
    
    if (!cpf) return null;
    
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

  validateAge(control: FormControl): { [key: string]: any } | null {
    const birthDate = new Date(control.value);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age >= 18 && age<= 120? null : { underAge: true };
  }


  validateDataAdmissao(control: FormControl): { [key: string]: any } | null {
    if (!control.value) return null; 
  
    const partes = control.value.split('-'); 
    const dataAdmissao = new Date(+partes[0], +partes[1] - 1, +partes[2]); 

    const hoje = new Date();
    const dataMinima = new Date(1988, 7, 30); 
  
    if (dataAdmissao < dataMinima) {
      return { dataAntiga: true }; 
    }
  
    if (dataAdmissao > hoje) {
      return { dataFutura: true }; 
    }
  
    return null;
  }
  

  submit() {
    if (this.alunoForm.valid) {
      const telefoneComMascara = this.alunoForm.get('telefone')?.value;
      const telefoneApenasNumeros = telefoneComMascara ? telefoneComMascara.replace(/\D/g, '') : '';

      const formData = { ...this.alunoForm.value, telefone: telefoneApenasNumeros }
      delete formData.confirmaSenha;
      
      if (this.dadosAluno) 
      {
        if (this.tipoCadastro === 'aluno') {
          this.onSubmitUpdate.emit(formData);
        } else if (this.tipoCadastro === 'instrutor') {
          this.onSubmitUpdate.emit(formData);
        }
      } else {
        if (this.tipoCadastro === 'aluno') {
          const alunoData = formData as AlunoCreateDTO;
          alunoData.observacao = this.alunoForm.get('observacao')?.value;
          alunoData.tipoUsuario="Aluno";
          this.onSubmit.emit(alunoData);
        } else if (this.tipoCadastro === 'instrutor') {
          const instrutorData = formData as InstrutorCreateDTO;
          instrutorData.dataAdmissao = this.alunoForm.get('dataAdmissao')?.value;
          instrutorData.categoriaCnh = this.alunoForm.get('categoriaCnh')?.value;
          this.onSubmit.emit(instrutorData);
        }
      }
    } else {
      console.log('Formulário inválido!');
    }
  }
}