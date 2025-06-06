import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { VeiculoViewModel } from '../../../models/VeiculoViewModel';
import { VeiculoService } from '../../../services/veiculo.service';

/* Angular Material */
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-detalhes-veiculo',
  imports: 
  [
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './detalhes-veiculo.component.html',
  styleUrl: './detalhes-veiculo.component.css'
})

export class DetalhesVeiculoComponent implements OnInit {

  constructor(private veiculoService : VeiculoService, private route : ActivatedRoute, private router : Router) { }

  veiculo?: VeiculoViewModel;
  veiculoDetalhes: VeiculoViewModel | null = null;
  id!: number;

  @Input() btnAcao!: string
  @Input() btnTitulo!: string
  
  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    
    this.veiculoService.GetVeiculo(this.id).subscribe((data) =>{
      const dados = data.dados!;

      if(dados!== null) {
      dados.dataFabricacao = new Date(dados.dataFabricacao).toLocaleDateString('pt-BR');
      dados.dataAquisicao = new Date(dados.dataAquisicao).toLocaleDateString('pt-BR');

      this.veiculoDetalhes = dados;
      console.log(data);
      this.atualizarTextoBotao();}
    })
  }

  atualizarTextoBotao() {
    this.btnAcao = this.veiculoDetalhes?.statusVeiculo === 'Ativo' ? 'Inativar Veículo' : 'Ativar Veículo';
    this.btnTitulo = "Detalhes da Veículo";
  }

  InativaVeiculo(){
    this.veiculoService.InativaVeiculo(this.id).subscribe((data) => {
      console.log('Resposta do serviço de inativação:', data);
      console.log('Tentando navegar para a rota "/".');
      this.router.navigate(['/veiculo']);
    });
  }
}
