import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

/* Angular Material */
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatriculaService } from '../../../services/matricula.service';
import { MatriculaViewModel } from '../../../models/MatriculaViewModel';
import { parseISO } from 'date-fns';

@Component({
  selector: 'app-detalhes-matricula',
  imports: 
  [
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './detalhes-matricula.component.html',
  styleUrl: './detalhes-matricula.component.css'
})

export class DetalhesMatriculaComponent implements OnInit {

  constructor(private matriculaService : MatriculaService, 
              private route : ActivatedRoute, 
              private router : Router
              ) { }

  matricula?: MatriculaViewModel;
  matriculaDetalhes: MatriculaViewModel | null = null;
  id!: number;
  dataFimMinima!: boolean;

  @Input() btnAcao!: string
  @Input() btnTitulo!: string
  
  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    
    this.matriculaService.GetMatricula(this.id).subscribe((data) =>{
      const dados = data.dados!;
      const dataMinima = this.criarDataUndefined();

      if(dados!== null) {
      dados.dataInicio = new Date(dados.dataInicio).toLocaleDateString('pt-BR');
      dados.dataFim = new Date(dados.dataFim).toLocaleDateString('pt-BR');

      if(dados.dataFim)
      {
        if(dados.dataFim===dataMinima)
          this.dataFimMinima=true;
        else
          this.dataFimMinima=false;
      }

      this.matriculaDetalhes = dados;
      console.log(data);
      this.atualizarTextoBotao();}
    })
  }

  criarDataUndefined(){
    const dataMinima = new Date();
    dataMinima.setFullYear(1, 0, 1); // Ano 1, Janeiro (0), dia 1
    dataMinima.setHours(0, 0, 0, 0);

    const dataFormatada = dataMinima.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'UTC' // Importante para evitar deslocamentos
    });

    return dataFormatada;
  }

  atualizarTextoBotao() {
    this.btnAcao = this.matriculaDetalhes?.statusMatricula === 'Ativo' ? 'Inativar Matrícula' : 'Ativar Matrícula';
    this.btnTitulo = "Detalhes da Matrícula";
  }

  InativaMatricula(){
    this.matriculaService.InativaMatricula(this.id).subscribe((data) => {
      console.log('Resposta do serviço de inativação:', data);
      console.log('Tentando navegar para a rota "/".');
      this.router.navigate(['/matricula']);
    });
  }
}
