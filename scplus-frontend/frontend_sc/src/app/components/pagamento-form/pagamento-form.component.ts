import { Component, EventEmitter, Input, type OnInit, Output } from "@angular/core"
import { FormBuilder ,FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { RouterLink } from '@angular/router';
import type { PagamentoCreateDTO } from "../../dto/pagamento/PagamentoCreateDTO"
import type { PagamentoUpdateDTO } from "../../dto/pagamento/PagamentoUpdateDTO"
import type { PagamentoViewModel } from "../../models/PagamentoViewModel"
import { AlunoService } from "../../services/aluno.service"
import type { AlunoViewModel } from "../../models/AlunoViewModel"

/* Angular Material */
import { MatButtonModule } from "@angular/material/button"
import { MatCardModule } from "@angular/material/card"
import { MatInputModule } from "@angular/material/input"
import { MatSelectModule } from "@angular/material/select"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatDatepickerModule } from "@angular/material/datepicker"
import { MatNativeDateModule } from "@angular/material/core"
import { MatCheckboxModule } from "@angular/material/checkbox"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-pagamento-form",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
  ],
  templateUrl: "./pagamento-form.component.html",
  styleUrl: "./pagamento-form.component.css",
})
export class PagamentoFormComponent implements OnInit {
  @Input() btnAcao!: string
  @Input() btnTitulo!: string
  @Input() dadosPagamento: PagamentoViewModel | null = null
  @Output() onSubmit = new EventEmitter<PagamentoCreateDTO>()
  @Output() onSubmitUpdate = new EventEmitter<PagamentoUpdateDTO>()

  pagamentoForm!: FormGroup
  alunos: AlunoViewModel[] = []
  formasPagamento = ["À Vista", "Parcelado", "Cartão", "PIX", "Boleto"]
  isParcelado = false

  constructor(
    private formBuilder: FormBuilder,
    private alunoService: AlunoService,
  ) {}

  ngOnInit(): void {
    this.carregarAlunos()
    this.criarFormulario()

    if (this.dadosPagamento) {
      this.preencherFormulario()
    }

    // Observa mudanças na forma de pagamento
    this.pagamentoForm.get("formaPagamento")?.valueChanges.subscribe((value) => {
      this.isParcelado = value === "Parcelado"
      this.configurarValidadoresParcelamento()
    })
  }

  carregarAlunos(): void {
    this.alunoService.GetAlunos().subscribe((data) => {
      this.alunos = data?.dados ?? []
    })
  }

  criarFormulario(): void {
    this.pagamentoForm = this.formBuilder.group({
      valorTotal: ["", [Validators.required, Validators.min(0.01)]],
      formaPagamento: ["", Validators.required],
      descricao: [""],
      alunoId: ["", Validators.required],
      quantidadeParcelas: [""],
      dataPrimeiraParcela: [""],
      intervaloEntreParcelas: [30],
    })
  }

  configurarValidadoresParcelamento(): void {
    const quantidadeParcelasControl = this.pagamentoForm.get("quantidadeParcelas")
    const dataPrimeiraParcelaControl = this.pagamentoForm.get("dataPrimeiraParcela")

    if (this.isParcelado) {
      quantidadeParcelasControl?.setValidators([Validators.required, Validators.min(2), Validators.max(24)])
      dataPrimeiraParcelaControl?.setValidators([Validators.required])
    } else {
      quantidadeParcelasControl?.clearValidators()
      dataPrimeiraParcelaControl?.clearValidators()
    }

    quantidadeParcelasControl?.updateValueAndValidity()
    dataPrimeiraParcelaControl?.updateValueAndValidity()
  }

  preencherFormulario(): void {
    if (this.dadosPagamento) {
      this.pagamentoForm.patchValue({
        valorTotal: this.dadosPagamento.valorTotal,
        formaPagamento: this.dadosPagamento.formaPagamento,
        descricao: this.dadosPagamento.descricao,
        alunoId: this.dadosPagamento.alunoId,
      })
    }
  }

  submit(): void {
    if (this.pagamentoForm.valid) {
      const formValue = this.pagamentoForm.value

      if (this.dadosPagamento) {
        // Modo edição
        const pagamentoUpdate: PagamentoUpdateDTO = {
          valorTotal: formValue.valorTotal,
          formaPagamento: formValue.formaPagamento,
          descricao: formValue.descricao,
        }
        this.onSubmitUpdate.emit(pagamentoUpdate)
      } else {
        // Modo criação
        const pagamentoCreate: PagamentoCreateDTO = {
          valorTotal: formValue.valorTotal,
          formaPagamento: formValue.formaPagamento,
          descricao: formValue.descricao,
          alunoId: formValue.alunoId,
          quantidadeParcelas: this.isParcelado ? formValue.quantidadeParcelas : undefined,
          dataPrimeiraParcela: this.isParcelado ? this.formatarData(formValue.dataPrimeiraParcela) : undefined,
          intervaloEntreParcelas: this.isParcelado ? formValue.intervaloEntreParcelas : undefined,
        }
        this.onSubmit.emit(pagamentoCreate)
      }
    } else {
      this.marcarCamposComoTocados()
    }
  }

  private formatarData(data: Date): string {
    if (!data) return ""
    return data.toISOString().split("T")[0]
  }

  private marcarCamposComoTocados(): void {
    Object.keys(this.pagamentoForm.controls).forEach((key) => {
      this.pagamentoForm.get(key)?.markAsTouched()
    })
  }

  getErrorMessage(fieldName: string): string {
    const field = this.pagamentoForm.get(fieldName)

    if (field?.hasError("required")) {
      return `${fieldName} é obrigatório`
    }

    if (field?.hasError("min")) {
      return `${fieldName} deve ser maior que zero`
    }

    if (field?.hasError("max")) {
      return `${fieldName} deve ser menor que 25`
    }

    return ""
  }
}
