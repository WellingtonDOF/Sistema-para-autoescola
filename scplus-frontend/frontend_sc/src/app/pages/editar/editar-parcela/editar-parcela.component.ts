import { Component, type OnInit } from "@angular/core"
import { ParcelaFormComponent } from "../../../components/parcela-form/parcela-form.component"
import { ParcelaService } from "../../../services/parcela.service"
import type { ParcelaViewModel } from "../../../models/ParcelaViewModel"
import { ActivatedRoute, Router } from "@angular/router"
import type { ParcelaUpdateDTO } from "../../../dto/parcela/ParcelaUpdateDTO"

@Component({
  selector: "app-editar-parcela",
  imports: [ParcelaFormComponent],
  templateUrl: "./editar-parcela.component.html",
  styleUrl: "./editar-parcela.component.css",
})
export class EditarParcelaComponent implements OnInit {
  btnAcao = "Editar"
  btnTitulo = "Editar Parcela"
  parcela!: ParcelaViewModel

  constructor(
    private parcelaService: ParcelaService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get("id"))

    this.parcelaService.GetParcela(id).subscribe((data) => {
      this.parcela = data.dados!
    })
  }

  editarParcela(parcela: ParcelaUpdateDTO): void {
    console.log(parcela)
    this.parcelaService.EditarParcela(this.parcela.id, parcela).subscribe((data) => {
      console.log(data)
      if (data.sucesso) {
        this.router.navigate(["/parcela"])
      }
    })
  }
}
