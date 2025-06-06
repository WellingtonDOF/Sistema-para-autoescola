import { Component } from "@angular/core"
import { PagamentoFormComponent } from "../../../components/pagamento-form/pagamento-form.component"
import { PagamentoService } from "../../../services/pagamento.service"
import { Router } from "@angular/router"
import type { PagamentoCreateDTO } from "../../../dto/pagamento/PagamentoCreateDTO"

@Component({
  selector: "app-cadastro-pagamento",
  imports: [PagamentoFormComponent],
  templateUrl: "./cadastro-pagamento.component.html",
  styleUrl: "./cadastro-pagamento.component.css",
})
export class CadastroPagamentoComponent {
  btnAcao = "Cadastrar"
  btnTitulo = "Cadastrar Pagamento"

  constructor(
    private pagamentoService: PagamentoService,
    private router: Router,
  ) {}

  criarPagamento(pagamento: PagamentoCreateDTO): void {
    console.log(pagamento)

    this.pagamentoService.CreatePagamento(pagamento).subscribe((data) => {
      console.log(data)
      if (data.sucesso) {
        this.router.navigate(["/pagamento"])
      }
    })
  }
}
