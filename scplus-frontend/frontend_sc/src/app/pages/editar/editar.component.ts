import { Component, OnInit } from '@angular/core';
import { AlunoFormComponent } from '../../components/aluno-form/aluno-form.component';
import { AlunoService } from '../../services/aluno.service';
import { AlunoViewModel } from '../../models/AlunoViewModel';
import { ActivatedRoute, Router } from '@angular/router';
import { AlunoUpdateDTO } from '../../dto/aluno/AlunoUpdateDTO';
import { InstrutorViewModel } from '../../models/InstrutorViewModel';
import { InstrutorService } from '../../services/instrutor.service';
import { InstrutorUpdateDTO } from '../../dto/instrutor/InstrutorUpdateDTO';

@Component({
  selector: 'app-editar',
  imports: [AlunoFormComponent ],
  templateUrl: './editar.component.html',
  styleUrl: './editar.component.css'
})
export class EditarComponent implements OnInit{
  btnAcao: string = 'Editar';
  btnTitulo: string = 'Editar Aluno';
  btnEditar: boolean = true;
  aluno!: AlunoViewModel;
  instrutor!: InstrutorViewModel;
  tipoCadastro: 'aluno' | 'instrutor' = 'aluno';

  constructor(private alunoService: AlunoService, private instrutorService: InstrutorService, private route : ActivatedRoute, private router : Router) { }
  
  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.route.queryParams.subscribe(params => {
      this.tipoCadastro = params['tipo'] === 'instrutor' ? 'instrutor' : 'aluno';
    });  

    if(this.tipoCadastro === 'instrutor') {
      this.btnTitulo = 'Editar Instrutor';

      this.instrutorService.GetInstrutor(id).subscribe((data) =>{
        this.instrutor = data.dados!;
      })
    }else{
      this.alunoService.GetAluno(id).subscribe((data) =>{
        this.aluno = data.dados!;
      })
    }
  }

  handleFormData(formData: AlunoUpdateDTO | InstrutorUpdateDTO) {
    if (this.tipoCadastro === 'aluno') {
      this.editarAluno(formData as AlunoUpdateDTO);
    } else if (this.tipoCadastro === 'instrutor') {
      this.editarInstrutor(formData as InstrutorUpdateDTO);
    } else {
      console.error('Tipo de formulário ou dados inválidos para o tipo de edição.');
    }
  }

  editarAluno(aluno: AlunoUpdateDTO) {
    console.log(aluno);
    this.alunoService.EditarAluno(this.aluno.id, aluno).subscribe((data) => {
      console.log(data);
      this.router.navigate(['aluno']);
    });
  }

  editarInstrutor(instrutor: InstrutorUpdateDTO) {
    console.log(instrutor);
    this.instrutorService.EditarInstrutor(this.instrutor.id, instrutor).subscribe((data) => {
      console.log(data);
      this.router.navigate(['instrutor']);
    });
  }
}
