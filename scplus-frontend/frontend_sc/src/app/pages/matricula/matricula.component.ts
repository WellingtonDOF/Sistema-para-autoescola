import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TelefoneService } from '../../services/telefone.service';

/* Angular Material */
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatriculaViewModel } from '../../models/MatriculaViewModel';
import { MatriculaService } from '../../services/matricula.service';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-matricula',
  imports: 
  [
    RouterLink, 
    MatTableModule, 
    MatCardModule, 
    MatButtonModule,
    MatInputModule
  ],
  templateUrl: './matricula.component.html',
  styleUrl: './matricula.component.css'
})
export class MatriculaComponent implements OnInit {

  matriculas: MatriculaViewModel[] = [];
  matriculasGeral: MatriculaViewModel[] = [];
  colums = ['Situacao', 'Nome', 'CPF', 'Telefone', 'Plano', 'Quantidade', 'Ações', 'Excluir'];

  constructor( private matriculaService : MatriculaService, private navigationService : NavigationService, private telefoneService: TelefoneService, private router: Router) {}
  
  ngOnInit(): void {
    this.matriculaService.GetMatriculas().subscribe(data =>{

      data?.dados?.map((item) => {
        item.dataInicio = new Date(item.dataInicio).toLocaleDateString('pt-BR');
        item.dataFim = new Date(item.dataFim).toLocaleDateString('pt-BR');
        item.alunoTelefone = this.telefoneService.formatarTelefone(item.alunoTelefone!);

      })
      
      console.log(data)
      this.matriculas = data?.dados ?? [];
      this.matriculasGeral = data?.dados ?? []; 
    });  

  }

  navegarParaDetalhesAluno(alunoId: number): void {
    this.navigationService.setPreviousPage('matriculas');
    sessionStorage.setItem('previousPage', 'matriculas'); // Salva no sessionStorage
    this.router.navigate([`/detalhes/${alunoId}`], { queryParams: { tipo: 'aluno' } });
  }

  search(event: Event) {
    const value = (event.target as HTMLInputElement).value.toLowerCase();
  
    if (!value) {
      this.matriculas = [...this.matriculasGeral];
      return;
    }
  
    const valueNumerico = value.replace(/\D/g, '');
  
    this.matriculas = this.matriculasGeral.filter(matricula => {
      const cpfSemPontuacao = matricula.alunoCpf?.replace(/\D/g, '').toLowerCase();
      const categoriaPlano = matricula.categoriaPlano.toLowerCase();
  
      return (
        (value && categoriaPlano.includes(value)) ||
        (valueNumerico && cpfSemPontuacao?.includes(valueNumerico))
      );
    });
  }


}
