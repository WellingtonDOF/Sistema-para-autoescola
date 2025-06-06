import { Component, EventEmitter, Input, type OnInit, Output } from "@angular/core"
import { FormBuilder, type FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import type { ParcelaCreateDTO } from "../../dto/parcela/ParcelaCreateDTO"
import type { ParcelaUpdateDTO } from "../../dto/parcela/ParcelaUpdateDTO"
import type { ParcelaViewModel } from "../../models/ParcelaViewModel"

/* Angular Material */
import { MatButtonModule } from "@angular/material/button"
import { MatCardModule } from "@angular/material/card"
import { MatInputModule } from "@angular/material/input"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatDatepickerModule } from "@angular/material/datepicker"
import { MatNativeDateModule } from "@angular/material/core"
import { CommonModule } from "@angular/common"
import { RouterLink } from "@angular/router"
@Component({
  selector: "app-parcela-form",
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    RouterLink,
  ],
  templateUrl: "./parcela-form.component.html",
  styleUrl: "./parcela-form.component.css",
})
export class ParcelaFormComponent implements OnInit {
  @Input() btnAcao!: string
  @Input() btnTitulo!: string
  @Input() dadosParcela: ParcelaViewModel | null = null
  @Output() onSubmit = new EventEmitter<ParcelaCreateDTO>()
  @Output() onSubmitUpdate = new EventEmitter<ParcelaUpdateDTO>()

  parcelaForm!: FormGroup

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.criarFormulario()

    if (this.dadosParcela) {
      this.preencherFormulario()
    }
  }

  criarFormulario(): void {
    this.parcelaForm = this.formBuilder.group({
      numeroParcela: ["", [Validators.required, Validators.min(1)]],
      valor: ["", [Validators.required, Validators.min(0.01)]],
      dataVencimento: ["", Validators.required],
      juros: [0, [Validators.min(0)]],
      multa: [0, [Validators.min(0)]],
      observacao: [""],
      pagamentoId: ["", Validators.required],
    })
  }

  preencherFormulario(): void {
    if (this.dadosParcela) {
      // Converte a data string para Date object
      const dataVencimento = new Date(this.dadosParcela.dataVencimento.split("/").reverse().join("-"))

      this.parcelaForm.patchValue({
        numeroParcela: this.dadosParcela.numeroParcela,
        valor: this.dadosParcela.valor,
        dataVencimento: dataVencimento,
        juros: this.dadosParcela.juros,
        multa: this.dadosParcela.multa,
        observacao: this.dadosParcela.observacao,
        pagamentoId: this.dadosParcela.pagamentoId,
      })

      // Desabilita campos que não devem ser editados
      if (this.dadosParcela) {
        this.parcelaForm.get("numeroParcela")?.disable()
        this.parcelaForm.get("pagamentoId")?.disable()
      }
    }
  }

  submit(): void {
    if (this.parcelaForm.valid) {
      const formValue = this.parcelaForm.value

      if (this.dadosParcela) {
        // Modo edição
        const parcelaUpdate: ParcelaUpdateDTO = {
          valor: formValue.valor,
          dataVencimento: this.formatarData(formValue.dataVencimento),
          juros: formValue.juros,
          multa: formValue.multa,
          observacao: formValue.observacao,
        }
        this.onSubmitUpdate.emit(parcelaUpdate)
      } else {
        // Modo criação
        const parcelaCreate: ParcelaCreateDTO = {
          numeroParcela: formValue.numeroParcela,
          valor: formValue.valor,
          dataVencimento: this.formatarData(formValue.dataVencimento),
          juros: formValue.juros,
          multa: formValue.multa,
          observacao: formValue.observacao,
          pagamentoId: formValue.pagamentoId,
        }
        this.onSubmit.emit(parcelaCreate)
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
    Object.keys(this.parcelaForm.controls).forEach((key) => {
      this.parcelaForm.get(key)?.markAsTouched()
    })
  }

  getErrorMessage(fieldName: string): string {
    const field = this.parcelaForm.get(fieldName)

    if (field?.hasError("required")) {
      return `${fieldName} é obrigatório`
    }

    if (field?.hasError("min")) {
      return `${fieldName} deve ser maior que zero`
    }

    return ""
  }
}
