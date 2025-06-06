import { Component, type OnInit } from "@angular/core"
import { ParcelaService } from "../../services/parcela.service"
import type { ParcelaViewModel } from "../../models/ParcelaViewModel"
import { RouterLink } from "@angular/router"
import { FormsModule } from '@angular/forms'; // <-- Importe FormsModule aqui

/* Angular Material */
import { MatTableModule } from "@angular/material/table"
import { MatCardModule } from "@angular/material/card"
import { MatButtonModule } from "@angular/material/button"
import { MatInputModule } from "@angular/material/input"
import { MatSelectModule } from "@angular/material/select"
import { MatFormFieldModule } from "@angular/material/form-field"

@Component({
  selector: "app-parcela",
  imports: [
    RouterLink,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule
  ],
  templateUrl: "./parcela.component.html",
  styleUrl: "./parcela.component.css",
})
export class ParcelaComponent implements OnInit {
  parcelas: ParcelaViewModel[] = []
  parcelasGeral: ParcelaViewModel[] = []
  colums = ["Status", "Numero", "Valor", "Vencimento", "StatusParcela", "Atraso", "Pagamento", "Ações"]
  statusFiltro = ""
  diasVencimento = 7

  constructor(private parcelaService: ParcelaService) {}

  ngOnInit(): void {
    this.carregarParcelas()
  }

  carregarParcelas(): void {
    this.parcelaService.GetParcelas().subscribe((data) => {
      console.log(data.dados)
      this.parcelas = data?.dados ?? []
      this.parcelasGeral = data?.dados ?? []
    })
  }

  carregarVencidas(): void {
    this.parcelaService.GetParcelasVencidas().subscribe((data) => {
      this.parcelas = data?.dados ?? []
    })
  }

  carregarVencendoEm(): void {
    this.parcelaService.GetParcelasVencendoEm(this.diasVencimento).subscribe((data) => {
      this.parcelas = data?.dados ?? []
    })
  }

  search(event: Event): void {
    const value = (event.target as HTMLInputElement).value.toLowerCase()

    if (!value) {
      this.parcelas = [...this.parcelasGeral]
      return
    }

    const valueNumerico = value.replace(/\D/g, "")

    this.parcelas = this.parcelasGeral.filter((parcela) => {
      return (
        parcela.numeroParcela.toString().includes(value) ||
        parcela.valorFormatado.toLowerCase().includes(value) ||
        (valueNumerico && parcela.pagamentoId.toString().includes(valueNumerico))
      )
    })
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

  marcarComoPaga(id: number): void {
    if (confirm("Tem certeza que deseja marcar esta parcela como paga?")) {
      this.parcelaService.MarcarComoPaga(id).subscribe((data) => {
        console.log(data)
        if (data.sucesso) {
          // Recarrega a lista de parcelas após marcar como paga
          this.carregarParcelas()
        }
      })
    }
  }
}
