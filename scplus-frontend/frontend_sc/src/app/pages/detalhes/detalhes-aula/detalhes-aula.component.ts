import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AulaService } from '../../../services/aula.service';
import { AulaViewModel } from '../../../models/AulaViewModel';

/* Angular Material */
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-detalhes-aula',
  imports: [
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './detalhes-aula.component.html',
  styleUrl: './detalhes-aula.component.css'
})
export class DetalhesAulaComponent implements OnInit {

  constructor(private aulaService : AulaService, private route : ActivatedRoute, private router : Router) { }

  aula?: AulaViewModel;
  id!: number;

  @Input() btnTitulo!: string

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    this.aulaService.GetAula(this.id).subscribe((data) =>{
      const dados = data.dados!;
      this.aula = dados;
      this.atualizarTextoBotao();
    })
  }

  atualizarTextoBotao() {
    this.btnTitulo = "Detalhes da Aula";
  }
}
