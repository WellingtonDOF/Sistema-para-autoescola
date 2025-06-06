import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlunoService } from '../../services/aluno.service';
import { AlunoViewModel } from '../../models/AlunoViewModel';
import { TelefoneService } from '../../services/telefone.service';
import { InstrutorService } from '../../services/instrutor.service';
import { InstrutorViewModel } from '../../models/InstrutorViewModel';

/* Angular Material */
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-detalhes',
  imports: 
  [
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './detalhes.component.html',
  styleUrl: './detalhes.component.css'
})
export class DetalhesComponent implements OnInit {

  constructor(private alunoService : AlunoService, 
              private instrutorService : InstrutorService, 
              private telefoneService: TelefoneService, 
              private route : ActivatedRoute, 
              private router : Router,
              private navigationService : NavigationService) { }

  aluno?: AlunoViewModel;
  instrutor?: InstrutorViewModel;
  usuarioDetalhes: AlunoViewModel | InstrutorViewModel | null = null;
  exibirVoltarMatricula: boolean = false;

  id!: number;
  tipoCadastro: 'aluno' | 'instrutor' = 'aluno';

  @Input() btnAcao!: string
  @Input() btnTitulo!: string
  
  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    this.route.queryParams.subscribe(params => {
      this.tipoCadastro = params['tipo'] === 'instrutor' ? 'instrutor' : 'aluno';
    });  

    if(this.tipoCadastro === 'instrutor') {

      this.instrutorService.GetInstrutor(this.id).subscribe((data) =>{
        const dados = data.dados!;
        if(dados!== null) {
        dados.dataNascimento = new Date(dados.dataNascimento).toLocaleDateString('pt-BR');
        dados.dataAdmissao = new Date(dados.dataAdmissao).toLocaleDateString('pt-BR');
        dados.telefone = this.telefoneService.formatarTelefone(dados.telefone);
        this.usuarioDetalhes = dados;
        this.atualizarTextoBotao();}
      })
    }else{
      this.alunoService.GetAluno(this.id).subscribe((data) =>{
        const dados = data.dados!;
        if(dados!== null) {
        dados.dataNascimento = new Date(dados.dataNascimento).toLocaleDateString('pt-BR');
        dados.telefone = this.telefoneService.formatarTelefone(dados.telefone);
        this.usuarioDetalhes = dados;
        this.atualizarTextoBotao();}
      })
    }

    const storedPreviousPage = sessionStorage.getItem('previousPage');
    if (storedPreviousPage === 'matriculas') {
      this.exibirVoltarMatricula = true;
    } else {
      this.exibirVoltarMatricula = false;
    }  
  }

  voltarParaMatriculas() {
    sessionStorage.removeItem('previousPage');
    this.router.navigate(['/matricula']);
  }

  isAluno(usuario: any): usuario is AlunoViewModel {
    return 'statusPagamento' in usuario && 'statusCurso' in usuario;
  }
  
  atualizarTextoBotao() {
    if(this.tipoCadastro === 'instrutor') {
      this.btnAcao = this.usuarioDetalhes?.status === 'Ativo' ? 'Inativar Instrutor' : 'Ativar Instrutor';
      this.btnTitulo = "Detalhes do Instrutor";
    }else{
      this.btnAcao = this.usuarioDetalhes?.status === 'Ativo' ? 'Inativar Aluno' : 'Ativar Aluno';
      this.btnTitulo = "Detalhes do Aluno";

    }
  }

  InativaUsuario(){
      if(this.tipoCadastro=== 'instrutor') {
        this.instrutorService.InativaFuncionario(this.id).subscribe((data) => {
          console.log('Resposta do serviço de inativação:', data);
          console.log('Tentando navegar para a rota "/".');
          this.router.navigate(['instrutor']);
        });
      }else{
        this.alunoService.InativaFuncionario(this.id).subscribe((data) => {
          console.log('Resposta do serviço de inativação:', data);
          console.log('Tentando navegar para a rota "/".');
          this.router.navigate(['']);
        });
      }
  }
}
