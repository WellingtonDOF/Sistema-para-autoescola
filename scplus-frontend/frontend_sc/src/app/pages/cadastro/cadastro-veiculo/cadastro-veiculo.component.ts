import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VeiculoFormComponent } from '../../../components/veiculo-form/veiculo-form.component';
import { VeiculoService } from '../../../services/veiculo.service';
import { VeiculoCreateDTO } from '../../../dto/veiculo/VeiculoCreateDTO';


@Component({
  selector: 'app-cadastro-veiculo',
  imports: [VeiculoFormComponent], 
  templateUrl: './cadastro-veiculo.component.html',
  styleUrl: './cadastro-veiculo.component.css'
})

export class CadastroVeiculoComponent{

  btnAcao = "Cadastrar";
  btnTitulo = "Cadastrar Veículo";

  constructor(private veiculoService: VeiculoService, private router: Router, private route : ActivatedRoute) {
  }

  createVeiculo(veiculo : VeiculoCreateDTO){
    this.veiculoService.CreateVeiculo(veiculo).subscribe((data)=>{
      this.router.navigate(['/veiculo']);
      console.log(data);
    });
  }
}
