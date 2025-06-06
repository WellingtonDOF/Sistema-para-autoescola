import { Component, Input, type OnInit } from "@angular/core"
import { ActivatedRoute, Router, RouterLink } from "@angular/router"
import { PagamentoService } from "../../../services/pagamento.service"
import type { PagamentoViewModel } from "../../../models/PagamentoViewModel"

/* Angular Material */
import { MatButtonModule } from "@angular/material/button"
import { MatCardModule } from "@angular/material/card"
import { MatInputModule } from "@angular/material/input"
import { MatSelectModule } from "@angular/material/select"
import { MatTableModule } from "@angular/material/table"
import { CommonModule } from "@angular/common"
import { ParcelaService } from "../../../services/parcela.service"

@Component({
  selector: "app-detalhes-pagamento",
  imports: [RouterLink, MatButtonModule, MatCardModule, MatInputModule, MatSelectModule, MatTableModule, CommonModule],
  templateUrl: "./detalhes-pagamento.component.html",
  styleUrl: "./detalhes-pagamento.component.css",
})
export class DetalhesPagamentoComponent implements OnInit {
  constructor(
    private pagamentoService: PagamentoService,
    private parcelaService: ParcelaService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  pagamentoDetalhes: PagamentoViewModel | null = null
  id!: number
  colunsParcelas = ["Numero", "Valor", "Status", "Vencimento", "Pagamento", "Atraso", "Ações"]

  @Input() btnAcao!: string
  @Input() btnTitulo!: string

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get("id"))

    this.pagamentoService.GetPagamento(this.id).subscribe((data) => {
      const dados = data.dados!
      if (dados !== null) {
        this.pagamentoDetalhes = dados
        this.atualizarTextoBotao()
      }
    })
  }

  atualizarTextoBotao(): void {
    if (this.pagamentoDetalhes?.statusPagamento === "Cancelado") {
      this.btnAcao = "Pagamento Cancelado"
      this.btnTitulo = "Detalhes do Pagamento"
    } else if (this.pagamentoDetalhes?.statusPagamento === "Pago") {
      this.btnAcao = "Pagamento Finalizado"
      this.btnTitulo = "Detalhes do Pagamento"
    } else {
      this.btnAcao = "Cancelar Pagamento"
      this.btnTitulo = "Detalhes do Pagamento"
    }
  }

  cancelarPagamento(): void {
    if (this.pagamentoDetalhes?.statusPagamento === "Cancelado" || this.pagamentoDetalhes?.statusPagamento === "Pago") {
      return
    }

    if (confirm("Tem certeza que deseja cancelar este pagamento?")) {
      this.pagamentoService.CancelarPagamento(this.id).subscribe((data) => {
        console.log("Resposta do serviço de cancelamento:", data)
        this.router.navigate(["pagamento"])
      })
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case "Paga":
        return "success"
      case "Pendente":
        return "warning"
      case "Vencida":
        return "danger"
      case "Cancelada":
        return "secondary"
      default:
        return "secondary"
    }
  }

  marcarParcelaComoPaga(parcelaId: number): void {
     if (confirm("Tem certeza que deseja marcar esta parcela como paga?")) {
      this.parcelaService.MarcarComoPaga(parcelaId).subscribe((data) => {
        console.log(data)
        if (data.sucesso) {
          window.location.reload()
        }
      })
    }
  }
}
