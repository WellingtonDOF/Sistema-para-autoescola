import { Component, OnInit } from '@angular/core';
import { AlunoFormComponent } from '../../components/aluno-form/aluno-form.component';
import { AlunoCreateDTO } from '../../dto/aluno/AlunoCreateDTO';
import { AlunoService } from '../../services/aluno.service';
import { ActivatedRoute, Router } from '@angular/router';
import { InstrutorCreateDTO } from '../../dto/instrutor/InstrutorCreateDTO';
import { InstrutorService } from '../../services/instrutor.service';


@Component({
  selector: 'app-cadastro',
  imports: [AlunoFormComponent], 
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.css'
})

export class CadastroComponent implements OnInit{

  btnAcao = "Cadastrar";
  btnTitulo = "Cadastrar Aluno";
  tipoCadastro: 'aluno' | 'instrutor' = 'aluno';

  constructor(private alunoService: AlunoService, private instrutorService: InstrutorService, private router: Router, private route : ActivatedRoute) {
  }

  ngOnInit(): void {  
    this.route.queryParams.subscribe(params => {
      this.tipoCadastro = params['tipo'] === 'instrutor' ? 'instrutor' : 'aluno';
    });  

    if (this.tipoCadastro === 'instrutor') {
      this.btnTitulo = "Cadastrar Instrutor";
    } else {
      this.btnTitulo = "Cadastrar Aluno";
    }
    console.log(this.tipoCadastro)
  }

  handleFormData(formData: AlunoCreateDTO | InstrutorCreateDTO) {
    if (this.tipoCadastro === 'aluno' && 'observacao' in formData) {
      this.createAluno(formData as AlunoCreateDTO) ;
    } else if (this.tipoCadastro === 'instrutor' && 'categoriaCnh' in formData && 'dataAdmissao' in formData) {
      this.createInstrutor(formData as InstrutorCreateDTO);
    } else {
      console.error('Tipo de formulário ou dados inválidos para o tipo de cadastro.');
    }
  }

  createAluno(aluno : AlunoCreateDTO){
    this.alunoService.CreateAluno(aluno).subscribe((data)=>{
      this.router.navigate(['/']);
      console.log(data);
    });
  }

  createInstrutor(instrutor : InstrutorCreateDTO){
    this.instrutorService.CreateInstrutor(instrutor).subscribe((data)=>{
      this.router.navigate(['instrutor']);
      console.log(data);
    });
  }
}
