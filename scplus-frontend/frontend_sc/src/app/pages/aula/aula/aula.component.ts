import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AulaViewModel } from '../../../models/AulaViewModel';
import { AulaService } from '../../../services/aula.service';
import { TruncatePipe } from '../../../pipes/truncate.pipe';

/* Angular Material */
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-aula',
  imports: [
    RouterLink,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    TruncatePipe
],
  templateUrl: './aula.component.html',
  styleUrl: './aula.component.css'
})
export class AulaComponent implements OnInit{

  aulas: AulaViewModel[] = [];
  aulasGeral: AulaViewModel[] = [];
  colums = ['TipoAula', 'Descricao', 'Ações'];

  constructor( private aulaService : AulaService) {}
  
  ngOnInit(): void {
    this.aulaService.GetAulas().subscribe(data =>{
      console.log(data.dados);

      this.aulas = data?.dados ?? [];
      this.aulasGeral = data?.dados ?? []; 
    });  
  }

  removerAcentos(texto: string): string {
    return texto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  search(event: Event) {
    const value = (event.target as HTMLInputElement).value.toLowerCase();
  
    if (!value) {
      this.aulas = [...this.aulasGeral]; 
      return;
    }

    const termoBusca = this.removerAcentos(value);

    this.aulas = this.aulasGeral.filter(aulas => {
      const tipoAula = this.removerAcentos(aulas.tipoAula);
      const descricao = this.removerAcentos(aulas.descricao);

      return (
        (value && tipoAula.includes(termoBusca)) ||
        (value && descricao.includes(termoBusca))
      );
    });
  }
}
