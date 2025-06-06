import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AulaFormComponent } from '../../../components/aula-form/aula-form.component';
import { AulaViewModel } from '../../../models/AulaViewModel';
import { AulaService } from '../../../services/aula.service';
import { AulaUpdateDTO } from '../../../dto/aula/aulaUpdateDTO';

@Component({
  selector: 'app-editar-aula',
  imports: [AulaFormComponent],
  templateUrl: './editar-aula.component.html',
  styleUrl: './editar-aula.component.css'
})
export class EditarAulaComponent implements OnInit{
  btnAcao: string = 'Editar';
  btnTitulo: string = 'Editar Aula';
  btnEditar: boolean = true;
  aula!: AulaViewModel;

  constructor(private aulaService: AulaService, private route : ActivatedRoute, private router : Router) { }
  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.aulaService.GetAula(id).subscribe((data) =>{
      this.aula = data.dados!;
    })
  }

  editarAula(aula: AulaUpdateDTO) {
    console.log(aula);
    this.aulaService.EditarAula(this.aula.id, aula).subscribe((data) => {
      console.log(data);
      this.router.navigate(['/aula']);
    });
  }
}
