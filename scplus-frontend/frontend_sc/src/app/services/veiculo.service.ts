
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Response } from '../models/Response';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ResponseSucesso } from '../models/ResponseSucesso';
import { ResponseErro } from '../models/ResponseErro';
import { VeiculoResponseDTO } from '../dto/veiculo/VeiculoResponseDTO';
import { VeiculoViewModel } from '../models/VeiculoViewModel';
import { VeiculoCreateDTO } from '../dto/veiculo/VeiculoCreateDTO';
import { VeiculoUpdateDTO } from '../dto/veiculo/VeiculoUpdateDTO';


@Injectable({
  providedIn: 'root'
})
export class VeiculoService {

  private apiUrl = `${environment.ApiUrl}/veiculo`; // URL da API

  constructor(private http: HttpClient) { }

  private mapVeiculoResponseToViewModel(veiculoResponse: VeiculoResponseDTO): VeiculoViewModel {
    return {
        id: veiculoResponse.id,
        placa: veiculoResponse.placa, 
        modelo: veiculoResponse.modelo,
        marca: veiculoResponse.marca,
        dataFabricacao: veiculoResponse.dataFabricacao,
        categoria: veiculoResponse.categoria, 
        dataAquisicao: veiculoResponse.dataAquisicao,
        statusVeiculo: veiculoResponse.statusVeiculo,
      };
    }

    GetVeiculo(id : number) : Observable<Response<VeiculoViewModel>> {
      return this.http.get<Response<VeiculoResponseDTO>>(`${this.apiUrl}/${id}`).pipe(
        map(response =>{
          if(response.sucesso && response.dados){
              const veiculoViewModel = this.mapVeiculoResponseToViewModel(response.dados);
              return new ResponseSucesso<VeiculoViewModel>(veiculoViewModel, response.mensagem);
          } else {
              return new ResponseErro<VeiculoViewModel>(null, response.mensagem);
          }
        }),
        catchError(error => {
          console.error('Erro na requisição:', error);
          return of(new ResponseErro<VeiculoViewModel>(null, 'Erro na requisição.'));
        })
      );
    }
    
    VerificarPlacaExistente(placa: string): Observable<Response<boolean>> {
      return this.http.get<Response<boolean>>(`${this.apiUrl}/verificar-placa/${placa}`).pipe(
        map(response => {
          if(response.sucesso) {
            const existe = response.dados ?? false;
            return new ResponseSucesso<boolean>(existe, response.mensagem);
          } else {
            return new ResponseErro<boolean>(false, response.mensagem);
          }
        }),
        catchError(error => {
          console.error('Erro na verificação da Placa:', error);
          return of(new ResponseErro<boolean>(false, 'Erro ao verificar Placa.'));
        })
      );
    }
    
    GetVeiculos() : Observable<Response<VeiculoViewModel[]>> {
      return this.http.get<Response<VeiculoResponseDTO[]>>(this.apiUrl).pipe(
        map(response =>{
          if(response.sucesso && response.dados){
              const veiculoViewModel = response.dados.map(dto => this.mapVeiculoResponseToViewModel(dto));
              return new ResponseSucesso<VeiculoViewModel[]>(veiculoViewModel, response.mensagem);
          } else {
              const veiculoViewModel = response.dados?.map(dto => this.mapVeiculoResponseToViewModel(dto)) ?? [];
              return new ResponseErro<VeiculoViewModel[]>(veiculoViewModel, response.mensagem);
          }
        }),
        catchError(error => {
          console.error('Erro na requisição:', error);
          return of(new ResponseErro<VeiculoViewModel[]>([], 'Erro na requisição.'));
        })
      );
    }        
    
    CreateVeiculo(veiculo: VeiculoCreateDTO ): Observable<Response<VeiculoViewModel>> {
      return this.http.post<Response<VeiculoResponseDTO>>(this.apiUrl, veiculo).pipe(
        map(response =>{
          if(response.sucesso && response.dados){
            const veiculoViewModel = this.mapVeiculoResponseToViewModel(response.dados);
            return new ResponseSucesso<VeiculoViewModel>(veiculoViewModel, response.mensagem);
          } else {
            return new ResponseErro<VeiculoViewModel>(null, response.mensagem || 'Erro ao criar veículo.');
          }
        }),
        catchError(error => {
          console.error('Erro na requisição:', error);
          return of(new ResponseErro<VeiculoViewModel>(null, 'Erro na requisição ao criar veículo.'));
        })
      );
    }

    EditarVeiculo(id : number, veiculo: VeiculoUpdateDTO): Observable<Response<VeiculoViewModel>> {
      return this.http.patch<Response<VeiculoResponseDTO>>(`${this.apiUrl}/${id}`, veiculo).pipe(
        map(response =>{
          if(response.sucesso && response.dados){
              const veiculoViewModel = this.mapVeiculoResponseToViewModel(response.dados);
              return new ResponseSucesso<VeiculoViewModel>(veiculoViewModel, response.mensagem);
          } else {
              return new ResponseErro<VeiculoViewModel>(null, response.mensagem);
          }
        }),
        catchError(error => {
          console.error('Erro na requisição:', error);
          return of(new ResponseErro<VeiculoViewModel>(null, 'Erro na requisição.'));
        })
      );
    }

    InativaVeiculo(id : number): Observable<Response<VeiculoViewModel>> {
      return this.http.put<Response<VeiculoResponseDTO>>(`${this.apiUrl}/mudar-status/${id}`, id).pipe(
        map(response =>{
          if(response.sucesso && response.dados){
              const veiculoViewModel = this.mapVeiculoResponseToViewModel(response.dados);
              return new ResponseSucesso<VeiculoViewModel>(veiculoViewModel, response.mensagem);
          } else {
              return new ResponseErro<VeiculoViewModel>(null, response.mensagem);
          }
        }),
        catchError(error => {
          console.error('Erro na requisição:', error);
          return of(new ResponseErro<VeiculoViewModel>(null, 'Erro na requisição.'));
        })
      );
    }
}
