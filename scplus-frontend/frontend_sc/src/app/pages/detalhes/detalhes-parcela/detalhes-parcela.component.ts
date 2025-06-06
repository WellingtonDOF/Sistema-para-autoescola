import { Component, Input, type OnInit } from "@angular/core"
import { ActivatedRoute, Router, RouterLink } from "@angular/router"
import { ParcelaService } from "../../../services/parcela.service"
import type { ParcelaViewModel } from "../../../models/ParcelaViewModel"

/* Angular Material */
import { MatButtonModule } from "@angular/material/button"
import { MatCardModule } from "@angular/material/card"
import { MatInputModule } from "@angular/material/input"
import { MatSelectModule } from "@angular/material/select"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-detalhes-parcela",
  imports: [
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    CommonModule,
    RouterLink
  ],
  templateUrl: "./detalhes-parcela.component.html",
  styleUrl: "./detalhes-parcela.component.css",
})
export class DetalhesParcelaComponent implements OnInit {
  constructor(
    private parcelaService: ParcelaService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  parcelaDetalhes: ParcelaViewModel | null = null
  id!: number

  @Input() btnAcao!: string
  @Input() btnTitulo!: string

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get("id"))

    this.parcelaService.GetParcela(this.id).subscribe((data) => {
      const dados = data.dados!
      if (dados !== null) {
        this.parcelaDetalhes = dados
        this.atualizarTextoBotao()
      }
    })
  }

  atualizarTextoBotao(): void {
    if (this.parcelaDetalhes?.statusParcela === "Paga") {
      this.btnAcao = "Parcela Paga"
      this.btnTitulo = "Detalhes da Parcela"
    } else if (this.parcelaDetalhes?.statusParcela === "Cancelada") {
      this.btnAcao = "Parcela Cancelada"
      this.btnTitulo = "Detalhes da Parcela"
    } else {
      this.btnAcao = "Marcar como Paga"
      this.btnTitulo = "Detalhes da Parcela"
    }
  }

  marcarComoPaga(): void {
    if (this.parcelaDetalhes?.statusParcela === "Paga" || this.parcelaDetalhes?.statusParcela === "Cancelada") {
      return
    }

    if (confirm("Tem certeza que deseja marcar esta parcela como paga?")) {
      this.parcelaService.MarcarComoPaga(this.id).subscribe((data) => {
        console.log("Resposta do serviço:", data)
        if (data.sucesso) {
          this.router.navigate(["parcela"])
        }
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
}
