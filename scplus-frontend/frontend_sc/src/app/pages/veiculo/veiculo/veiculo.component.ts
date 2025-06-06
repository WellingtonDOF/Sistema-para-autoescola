
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { VeiculoService } from '../../../services/veiculo.service';

/* Angular Material */
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { VeiculoViewModel } from '../../../models/VeiculoViewModel';

@Component({
  selector: 'app-veiculo',
  imports: 
  [
    RouterLink, 
    MatTableModule, 
    MatCardModule, 
    MatButtonModule,
    MatInputModule
  ],
  templateUrl: './veiculo.component.html',
  styleUrl: './veiculo.component.css'
})
export class VeiculoComponent implements OnInit {

  veiculos: VeiculoViewModel[] = [];
  veiculosGeral: VeiculoViewModel[] = [];
  colums = ['Situacao', 'Placa', 'Categoria', 'DataAquisicao', 'Ações', 'Excluir'];

  constructor( private veiculoService : VeiculoService, private router: Router) {}
  
  ngOnInit(): void {
    this.veiculoService.GetVeiculos().subscribe(data =>{

      data?.dados?.map((item) => {
        item.dataAquisicao = new Date(item.dataAquisicao).toLocaleDateString('pt-BR');
        item.dataFabricacao = new Date(item.dataFabricacao).toLocaleDateString('pt-BR');
      })
      
      console.log(data)
      this.veiculos = data?.dados ?? [];
      this.veiculosGeral = data?.dados ?? []; 
    });  
  }

  search(event: Event) {
    const value = (event.target as HTMLInputElement).value.toLowerCase();
  
    if (!value) {
      this.veiculos = [...this.veiculosGeral];
      return;
    }
    
    this.veiculos = this.veiculosGeral.filter(veiculo => {
      const placa = veiculo.placa?.replace(/[^a-z0-9]/gi, '').toLowerCase();
      const categoriaPlano = veiculo.categoria.toLowerCase();
  
      return (
        (value && categoriaPlano.includes(value)) ||
        (value && placa.includes(value))
      );
    });
  }


}
