import { Injectable } from '@angular/core';
import { AulaResponseDTO } from '../dto/aula/aulaResponseDTO';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Response } from '../models/Response';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ResponseSucesso } from '../models/ResponseSucesso';
import { ResponseErro } from '../models/ResponseErro';
import { AulaViewModel } from '../models/AulaViewModel';
import { AulaUpdateDTO } from '../dto/aula/aulaUpdateDTO';

@Injectable({
  providedIn: 'root'
})
export class AulaService {

  private apiUrl = `${environment.ApiUrl}/aula`; // URL da API

  constructor(private http: HttpClient) { }

  private mapAulaResponseToViewModel(aulaResponse: AulaResponseDTO): AulaViewModel {
    return {
        id: aulaResponse.id,
        tipoAula: aulaResponse.tipoAula, 
        descricao: aulaResponse.descricao,
      };
    }

  GetAula(id : number) : Observable<Response<AulaViewModel>> {
      return this.http.get<Response<AulaResponseDTO>>(`${this.apiUrl}/${id}`).pipe(
        map(response =>{
          if(response.sucesso && response.dados){
              const aulaViewModel = this.mapAulaResponseToViewModel(response.dados);
              return new ResponseSucesso<AulaViewModel>(aulaViewModel, response.mensagem);
          } else {
              return new ResponseErro<AulaViewModel>(null, response.mensagem);
          }
        }),
        catchError(error => {
          console.error('Erro na requisição:', error);
          return of(new ResponseErro<AulaViewModel>(null, 'Erro na requisição.'));
        })
      );
    }

  GetAulas() : Observable<Response<AulaViewModel[]>> {
      return this.http.get<Response<AulaResponseDTO[]>>(this.apiUrl).pipe(
        map(response =>{
          if(response.sucesso && response.dados){
              const aulasViewModel = response.dados.map(dto => this.mapAulaResponseToViewModel(dto));
              return new ResponseSucesso<AulaViewModel[]>(aulasViewModel, response.mensagem);
          } else {
              const aulasViewModel = response.dados?.map(dto => this.mapAulaResponseToViewModel(dto)) ?? [];
              return new ResponseErro<AulaViewModel[]>(aulasViewModel, response.mensagem);
          }
        }),
        catchError(error => {
          console.error('Erro na requisição:', error);
          return of(new ResponseErro<AulaViewModel[]>([], 'Erro na requisição.'));
        })
      );
    }        
        
  EditarAula(id : number, aluno: AulaUpdateDTO): Observable<Response<AulaViewModel>> {
      return this.http.patch<Response<AulaResponseDTO>>(`${this.apiUrl}/${id}`, aluno).pipe(
        map(response =>{
          if(response.sucesso && response.dados){
              const aulaViewModel = this.mapAulaResponseToViewModel(response.dados);
              return new ResponseSucesso<AulaViewModel>(aulaViewModel, response.mensagem);
          } else {
              return new ResponseErro<AulaViewModel>(null, response.mensagem);
          }
        }),
        catchError(error => {
          console.error('Erro na requisição:', error);
          return of(new ResponseErro<AulaViewModel>(null, 'Erro na requisição.'));
        })
      );
    }
}
