import { Component, OnInit } from '@angular/core';
import { InstrutorService } from '../../services/instrutor.service';
import { InstrutorViewModel } from '../../models/InstrutorViewModel';
import { RouterLink } from '@angular/router';
import { TelefoneService } from '../../services/telefone.service';

/* Angular Material */
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-instrutor',
  imports: 
  [
    RouterLink, 
    MatTableModule, 
    MatCardModule, 
    MatButtonModule,
    MatInputModule
  ],
  templateUrl: './instrutor.component.html',
  styleUrl: './instrutor.component.css'
})
export class InstrutorComponent implements OnInit {

  instrutores: InstrutorViewModel[] = [];
  instrutoresGeral: InstrutorViewModel[] = [];
  colums = ['Situacao','Nome', 'CPF', 'Email', 'Telefone', 'Ações', 'Excluir'];

  constructor( private instrutorService : InstrutorService, private telefoneService : TelefoneService) {}
  
  ngOnInit(): void {
    this.instrutorService.GetInstrutores().subscribe(data =>{
      console.log(data.dados);
      const dados = data.dados; 

      data?.dados?.map((item) => {
        item.dataNascimento = new Date(item.dataNascimento).toLocaleDateString('pt-BR');
        item.telefone = this.telefoneService.formatarTelefone(item.telefone);
      })
      
      this.instrutores = data?.dados ?? [];
      this.instrutoresGeral = data?.dados ?? []; 
    });  
  }

  search(event: Event) {
    const value = (event.target as HTMLInputElement).value.toLowerCase();
  
    if (!value) {
      this.instrutores = [...this.instrutoresGeral]; // ou this.alunosGeral.slice()
      return;
    }
  
    const valueNumerico = value.replace(/\D/g, '');
  
    this.instrutores = this.instrutoresGeral.filter(instrutor => {
      const cpfSemPontuacao = instrutor.cpf.replace(/\D/g, '').toLowerCase();
      const nomeCompletoLower = instrutor.nomeCompleto.toLowerCase();
  
      return (
        (value && nomeCompletoLower.includes(value)) ||
        (valueNumerico && cpfSemPontuacao.includes(valueNumerico))
      );
    });
  }
}
