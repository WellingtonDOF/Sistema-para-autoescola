import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

/* Angular Material */
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AulaUpdateDTO } from '../../dto/aula/aulaUpdateDTO';
import { AulaViewModel } from '../../models/AulaViewModel';
import { AulaService } from '../../services/aula.service';

@Component({
  selector: 'app-aula-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './aula-form.component.html',
  styleUrl: './aula-form.component.css'
})
export class AulaFormComponent implements OnInit {
  @Output() onSubmitUpdate = new EventEmitter<AulaUpdateDTO>();

  
  @Input() btnAcao!: string;
  @Input() btnTitulo!: string;
  @Input() dadosAula: AulaViewModel | null = null;

  aulaForm!: FormGroup;
  id: number | null = null;

  constructor(private route: ActivatedRoute, private http: HttpClient, private aulaService: AulaService) { }

  ngOnInit(): void {

    const formControls: any = {
      id: new FormControl(this.dadosAula ? this.dadosAula.id : 0),
      tipoAula: new FormControl(this.dadosAula?.tipoAula || '', [
        Validators.required,
      ]),
      descricao: new FormControl(this.dadosAula?.descricao || '', [
        Validators.required,
        Validators.maxLength(150)
      ]),
    };

    this.aulaForm = new FormGroup(formControls);
    console.log(this.aulaForm.value);
  }  

  submit() {
    if (this.aulaForm.valid) {
      this.onSubmitUpdate.emit(this.aulaForm.value);
    } else {
      console.log('Formulário inválido!');
    }
  }
}
