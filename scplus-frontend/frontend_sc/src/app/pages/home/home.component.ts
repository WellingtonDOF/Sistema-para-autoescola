import { Component, OnInit } from '@angular/core';
import { AlunoService } from '../../services/aluno.service';
import { AlunoViewModel } from '../../models/AlunoViewModel';
import { RouterLink } from '@angular/router';
import { TelefoneService } from '../../services/telefone.service';

/* Angular Material */
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-home',
  imports: 
  [
    RouterLink, 
    MatTableModule, 
    MatCardModule, 
    MatButtonModule,
    MatInputModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  alunos: AlunoViewModel[] = [];
  alunosGeral: AlunoViewModel[] = [];
  colums = ['Situacao','Nome', 'CPF', 'Email', 'Telefone', 'Ações', 'Excluir'];

  constructor( private alunoService : AlunoService, private telefoneService : TelefoneService) {}
  
  ngOnInit(): void {
    this.alunoService.GetAlunos().subscribe(data =>{
      console.log(data.dados);
      const dados = data.dados; // Acessa a propriedade 'dados' do objeto retornado

      data?.dados?.map((item) => {
        item.dataNascimento = new Date(item.dataNascimento).toLocaleDateString('pt-BR');
        item.telefone = this.telefoneService.formatarTelefone(item.telefone);
      })
      
      this.alunos = data?.dados ?? [];
      this.alunosGeral = data?.dados ?? []; 
    });  
  }

  search(event: Event) {
    const value = (event.target as HTMLInputElement).value.toLowerCase();
  
    if (!value) {
      this.alunos = [...this.alunosGeral]; // ou this.alunosGeral.slice()
      return;
    }
  
    const valueNumerico = value.replace(/\D/g, '');
  
    this.alunos = this.alunosGeral.filter(aluno => {
      const cpfSemPontuacao = aluno.cpf.replace(/\D/g, '').toLowerCase();
      const nomeCompletoLower = aluno.nomeCompleto.toLowerCase();
  
      return (
        (value && nomeCompletoLower.includes(value)) ||
        (valueNumerico && cpfSemPontuacao.includes(valueNumerico))
      );
    });
  }
}
