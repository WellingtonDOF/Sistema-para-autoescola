import { Component, type OnInit } from "@angular/core"
import { PagamentoFormComponent } from "../../../components/pagamento-form/pagamento-form.component"
import { PagamentoService } from "../../../services/pagamento.service"
import type { PagamentoViewModel } from "../../../models/PagamentoViewModel"
import { ActivatedRoute, Router } from "@angular/router"
import type { PagamentoUpdateDTO } from "../../../dto/pagamento/PagamentoUpdateDTO"

@Component({
  selector: "app-editar-pagamento",
  imports: [PagamentoFormComponent],
  templateUrl: "./editar-pagamento.component.html",
  styleUrl: "./editar-pagamento.component.css",
})
export class EditarPagamentoComponent implements OnInit {
  btnAcao = "Editar"
  btnTitulo = "Editar Pagamento"
  pagamento!: PagamentoViewModel

  constructor(
    private pagamentoService: PagamentoService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get("id"))

    this.pagamentoService.GetPagamento(id).subscribe((data) => {
      this.pagamento = data.dados!
    })
  }

  editarPagamento(pagamento: PagamentoUpdateDTO): void {
    console.log(pagamento)
    this.pagamentoService.EditarPagamento(this.pagamento.id, pagamento).subscribe((data) => {
      console.log(data)
      if (data.sucesso) {
        this.router.navigate(["/pagamento"])
      }
    })
  }
}
