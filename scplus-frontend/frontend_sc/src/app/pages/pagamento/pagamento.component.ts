import { Component, type OnInit } from "@angular/core"
import { PagamentoService } from "../../services/pagamento.service"
import { PagamentoViewModel } from "../../models/PagamentoViewModel"
import { RouterLink } from "@angular/router"

/* Angular Material */
import { MatTableModule } from "@angular/material/table"
import { MatCardModule } from "@angular/material/card"
import { MatButtonModule } from "@angular/material/button"
import { MatInputModule } from "@angular/material/input"
import { MatSelectModule } from "@angular/material/select"
import { MatFormFieldModule } from "@angular/material/form-field"

@Component({
  selector: "app-pagamento",
  imports: [
    RouterLink,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
  ],
  templateUrl: "./pagamento.component.html",
  styleUrl: "./pagamento.component.css",
})
export class PagamentoComponent implements OnInit {
  pagamentos: PagamentoViewModel[] = []
  pagamentosGeral: PagamentoViewModel[] = []
  colums = ["Status", "Aluno", "Valor", "FormaPagamento", "StatusPagamento", "Parcelas", "Ações"]
  statusFiltro = ""

  constructor(private pagamentoService: PagamentoService) {}

  ngOnInit(): void {
    this.carregarPagamentos()
  }

  carregarPagamentos(): void {
    this.pagamentoService.GetPagamentos().subscribe((data) => {
      console.log(data.dados)
      this.pagamentos = data?.dados ?? []
      this.pagamentosGeral = data?.dados ?? []
    })
  }

  filtrarPorStatus(): void {
    if (!this.statusFiltro) {
      this.carregarPagamentos()
      return
    }

    this.pagamentoService.GetPagamentosPorStatus(this.statusFiltro).subscribe((data) => {
      this.pagamentos = data?.dados ?? []
    })
  }

  carregarVencidos(): void {
    this.pagamentoService.GetPagamentosVencidos().subscribe((data) => {
      this.pagamentos = data?.dados ?? []
    })
  }

  search(event: Event): void {
    const value = (event.target as HTMLInputElement).value.toLowerCase()

    if (!value) {
      this.pagamentos = [...this.pagamentosGeral]
      return
    }

    this.pagamentos = this.pagamentosGeral.filter((pagamento) => {
      const nomeAlunoLower = pagamento.nomeAluno.toLowerCase()
      const cpfSemPontuacao = pagamento.cpfAluno.replace(/\D/g, "").toLowerCase()
      const valueNumerico = value.replace(/\D/g, "")

      return (
        nomeAlunoLower.includes(value) ||
        (valueNumerico && cpfSemPontuacao.includes(valueNumerico)) ||
        pagamento.formaPagamento.toLowerCase().includes(value)
      )
    })
  }

  getStatusColor(status: string): string {
    switch (status) {
      case "Pago":
        return "success"
      case "Pendente":
        return "warning"
      case "Parcial":
        return "info"
      case "Cancelado":
        return "danger"
      case "Vencido":
        return "danger"
      default:
        return "secondary"
    }
  }

  cancelarPagamento(id: number): void {
    if (confirm("Tem certeza que deseja cancelar este pagamento?")) {
      this.pagamentoService.CancelarPagamento(id).subscribe((data) => {
        console.log(data)
        if (data.sucesso) {
          // Recarrega a lista de pagamentos após cancelar
          this.carregarPagamentos()
        }
      })
    }
  }
}
