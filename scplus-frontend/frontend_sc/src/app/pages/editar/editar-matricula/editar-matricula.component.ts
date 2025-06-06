import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatriculaFormComponent } from '../../../components/matricula-form/matricula-form.component';
import { MatriculaViewModel } from '../../../models/MatriculaViewModel';
import { MatriculaService } from '../../../services/matricula.service';
import { MatriculaUpdateDTO } from '../../../dto/matricula/MatriculaUpdateDTO';


@Component({
  selector: 'app-editar-matricula',
  imports: [MatriculaFormComponent],
  templateUrl: './editar-matricula.component.html',
  styleUrl: './editar-matricula.component.css'
})
export class EditarMatriculaComponent implements OnInit{
  btnAcao: string = 'Editar';
  btnTitulo: string = 'Editar Matrícula';
  btnEditar: boolean = true;
  matricula!: MatriculaViewModel;

  constructor(private matriculaService: MatriculaService, private route : ActivatedRoute, private router : Router) { }
  
  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
      this.matriculaService.GetMatricula(id).subscribe((data) =>{
        this.matricula = data.dados!;
      })
  }

  editarMatricula(matricula: MatriculaUpdateDTO) {
    console.log(matricula);
    this.matriculaService.EditarMatricula(this.matricula.id, matricula).subscribe((data) => {
      console.log(data);
      this.router.navigate(['/matricula']);
    });
  }
}
