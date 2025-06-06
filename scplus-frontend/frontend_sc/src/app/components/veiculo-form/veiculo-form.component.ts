import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { format, getDayOfYear } from 'date-fns';
import { NgxMaskDirective } from 'ngx-mask';
import { HttpClient } from '@angular/common/http';
import { catchError, debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

/* Angular Material */
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { VeiculoUpdateDTO } from '../../dto/veiculo/VeiculoUpdateDTO';
import { VeiculoCreateDTO } from '../../dto/veiculo/VeiculoCreateDTO';
import { VeiculoViewModel } from '../../models/VeiculoViewModel';
import { VeiculoService } from '../../services/veiculo.service';


@Component({
  selector: 'app-veiculo-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './veiculo-form.component.html',
  styleUrl: './veiculo-form.component.css'
})

export class VeiculoFormComponent implements OnInit {
  @Output() onSubmit = new EventEmitter<VeiculoCreateDTO>();
  @Output() onSubmitUpdate = new EventEmitter<VeiculoUpdateDTO>();

  @Input() btnAcao!: string;
  @Input() btnTitulo!: string;
  @Input() dadosVeiculo: VeiculoViewModel | null = null;

  veiculoForm!: FormGroup;
  id: number | null = null;
  
  constructor(private route: ActivatedRoute, private http: HttpClient, private veiculoService: VeiculoService) { }

  ngOnInit(): void {

    let dataAquisicao = '';
    if (this.dadosVeiculo?.dataAquisicao) {
      dataAquisicao = format(new Date(this.dadosVeiculo.dataAquisicao), 'yyyy-MM-dd');
    }

    let dataFabricacao = '';
    if (this.dadosVeiculo?.dataFabricacao) {
      dataFabricacao = format(new Date(this.dadosVeiculo.dataFabricacao), 'yyyy-MM-dd');
    }

    const formControls: any = {
      id: new FormControl(this.dadosVeiculo ? this.dadosVeiculo.id : 0),
      placa: new FormControl('', {
        validators: [Validators.required, this.validatePlaca.bind(this)],
        asyncValidators: [(control: AbstractControl) => this.validatePlacaExists(control)]
      }),
      modelo: new FormControl(this.dadosVeiculo?.modelo || '', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(200)
      ]),
      marca: new FormControl(this.dadosVeiculo?.marca || '', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(200)
      ]),
      dataFabricacao: new FormControl(dataFabricacao, [
        Validators.required,
        this.validateManufactureDate.bind(this)
      ]),
      dataAquisicao: new FormControl(dataAquisicao, [
        Validators.required,
        this.validateDates.bind(this)
      ]),
      categoria: new FormControl('', [Validators.required]),
    };
  
    // Cria o FormGroup com todos os controles
    this.veiculoForm = new FormGroup(formControls);

    this.veiculoForm.get('dataFabricacao')?.valueChanges.subscribe(() => {
      this.veiculoForm.get('dataAquisicao')?.updateValueAndValidity();
    });

    this.route.params.subscribe(params => {
      this.id = +params['id'];
      if (this.id && this.dadosVeiculo) {
        this.veiculoForm.removeControl('placa');
        this.veiculoForm.removeControl('categoria');
        this.veiculoForm.removeControl('id');
      }

      this.veiculoForm.get('placa')?.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.veiculoForm.get('placa')?.updateValueAndValidity();
      });
    });
  } 

  async validatePlacaExists(control: AbstractControl): Promise<ValidationErrors | null> {
    if (!control.value || control.errors?.['placaInvalida']) {
      return null;
    }
  
    const placa = control.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
  
    try {
      const response = await this.veiculoService.VerificarPlacaExistente(placa).toPromise();
      
      if (!response?.sucesso) {
        return null;
      }
      
      return response.dados ? { placaExistente: true } : null;
      
    } catch (error) {
      console.error('Erro na validação:', error);
      return null;
    }
  }
  

  validatePlaca(control: AbstractControl): { [key: string]: any } | null {
    const placa = control.value?.toUpperCase().replace(/[^A-Z0-9]/g, '') || '';

    if (!placa) return null;

    // Formatos aceitos
    const formatoAntigo = /^[A-Z]{3}[0-9]{4}$/;
    const formatoMercosul = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;

    if (!formatoAntigo.test(placa) && !formatoMercosul.test(placa)) {
      return { placaInvalida: true };
    }

    // Valida letras proibidas
    const letrasProibidas = /[IJQÑ]/;
    if (letrasProibidas.test(placa.substring(0, 3))) {
      return { placaInvalida: true };
    }

    return null;
  }
  

  validateDates(control: AbstractControl): { [key: string]: any } | null {
    const aquisicaoDate = new Date(control.value);
    const fabricacaoDate = new Date(this.veiculoForm?.get('dataFabricacao')?.value);
    
    if (isNaN(aquisicaoDate.getTime())) return null;
    
    if (isNaN(fabricacaoDate.getTime())) {
      return null; 
    }
    
    if (aquisicaoDate < fabricacaoDate) {
      return { acquisitionBeforeManufacture: true };
    }
    
    return null;
  }

  validateManufactureDate(control: AbstractControl): { [key: string]: any } | null {
    const inputDate = new Date(control.value);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    
    // Verifica se a data é inválida
    if (isNaN(inputDate.getTime())) {
      return { invalidDate: true };
    }
    
    const inputYear = inputDate.getFullYear();
    
    // Verifica se o ano é menor que 1950
    if (inputYear < 1950) {
      return { minYear: true };
    }
    
    // Verifica se o ano é maior que o atual + 1
    if (inputYear > currentYear + 1) {
      return { maxYear: true };
    }
    
    return null;
  }

  submit() {
    if (this.veiculoForm.valid) {
      if (this.dadosVeiculo) 
      {
          this.onSubmitUpdate.emit(this.veiculoForm.value);
      }
      else 
      {
        this.onSubmit.emit(this.veiculoForm.value);
      } 
    } else {
      console.log('Formulário inválido!');
    }
  }
}