import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VeiculoFormComponent } from '../../../components/veiculo-form/veiculo-form.component';
import { VeiculoViewModel } from '../../../models/VeiculoViewModel';
import { VeiculoUpdateDTO } from '../../../dto/veiculo/VeiculoUpdateDTO';
import { VeiculoService } from '../../../services/veiculo.service';


@Component({
  selector: 'app-editar-veiculo',
  imports: [VeiculoFormComponent],
  templateUrl: './editar-veiculo.component.html',
  styleUrl: './editar-veiculo.component.css'
})

export class EditarVeiculoComponent implements OnInit{
  btnAcao: string = 'Editar';
  btnTitulo: string = 'Editar Veículo';
  btnEditar: boolean = true;
  veiculo!: VeiculoViewModel;

  constructor(private veiculoService: VeiculoService, private route : ActivatedRoute, private router : Router) { }
  
  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
      this.veiculoService.GetVeiculo(id).subscribe((data) =>{
        this.veiculo = data.dados!;
      })
  }

  editarVeiculo(veiculo: VeiculoUpdateDTO) {
    console.log(veiculo);
    this.veiculoService.EditarVeiculo(this.veiculo.id, veiculo).subscribe((data) => {
      console.log(data);
      this.router.navigate(['/veiculo']);
    });
  }
}

