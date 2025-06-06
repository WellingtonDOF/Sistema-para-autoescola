import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatriculaFormComponent } from '../../../components/matricula-form/matricula-form.component';
import { MatriculaService } from '../../../services/matricula.service';
import { MatriculaCreateDTO } from '../../../dto/matricula/MatriculaCreateDTO';


@Component({
  selector: 'app-cadastro-matricula',
  imports: [MatriculaFormComponent], 
  templateUrl: './cadastro-matricula.component.html',
  styleUrl: './cadastro-matricula.component.css'
})

export class CadastroMatriculaComponent{

  btnAcao = "Cadastrar";
  btnTitulo = "Cadastrar Matrícula";

  constructor(private matriculaService: MatriculaService, private router: Router, private route : ActivatedRoute) {
  }

  createMatricula(matricula : MatriculaCreateDTO){
    this.matriculaService.CreateMatricula(matricula).subscribe((data)=>{
      this.router.navigate(['/matricula']);
      console.log(data);
    });
  }
}
