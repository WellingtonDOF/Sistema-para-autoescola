import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Response } from '../models/Response';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ResponseSucesso } from '../models/ResponseSucesso';
import { ResponseErro } from '../models/ResponseErro';
import { MatriculaResponseDTO } from '../dto/matricula/MatriculaResponseDTO';
import { MatriculaViewModel } from '../models/MatriculaViewModel';
import { MatriculaCreateDTO } from '../dto/matricula/MatriculaCreateDTO';
import { MatriculaUpdateDTO } from '../dto/matricula/MatriculaUpdateDTO';
import { MatriculaAlunoDTO } from '../dto/matricula/MatriculaAlunoDTO';

@Injectable({
  providedIn: 'root'
})
export class MatriculaService {

  private apiUrl = `${environment.ApiUrl}/matricula`; // URL da API

  constructor(private http: HttpClient) { }

  private formatarCPF(cpf: string): string {
    if (!cpf) {
      return '';
    }
    const cleanedCpf = cpf.replace(/\D/g, '');
    const formattedCpf = cleanedCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    return formattedCpf;
  }

  private mapMatriculaResponseToViewModel(matriculaResponse: MatriculaResponseDTO): MatriculaViewModel {
    return {
        id: matriculaResponse.id,
        alunoId: matriculaResponse.alunoId, 
        quantidadeAulaTotal: matriculaResponse.quantidadeAulaTotal,
        dataInicio: matriculaResponse.dataInicio,
        dataFim: matriculaResponse.dataFim,
        categoriaPlano: matriculaResponse.categoriaPlano, 
        statusMatricula: matriculaResponse.statusMatricula,
        alunoCpf: this.formatarCPF(matriculaResponse.alunoCpf),
        alunoNome: matriculaResponse.alunoNome,
        alunoTelefone: matriculaResponse.alunoTelefone
      };
    }

    GetMatricula(id : number) : Observable<Response<MatriculaViewModel>> {
      return this.http.get<Response<MatriculaResponseDTO>>(`${this.apiUrl}/${id}`).pipe(
        map(response =>{
          if(response.sucesso && response.dados){
              const matriculaViewModel = this.mapMatriculaResponseToViewModel(response.dados);
              return new ResponseSucesso<MatriculaViewModel>(matriculaViewModel, response.mensagem);
          } else {
              return new ResponseErro<MatriculaViewModel>(null, response.mensagem);
          }
        }),
        catchError(error => {
          console.error('Erro na requisição:', error);
          return of(new ResponseErro<MatriculaViewModel>(null, 'Erro na requisição.'));
        })
      );
    }

    VerificarCpfExistente(cpf: string): Observable<Response<MatriculaAlunoDTO | null>> {
      return this.http.get<Response<MatriculaAlunoDTO | null>>(`${this.apiUrl}/verificar-cpf/${cpf}`).pipe(
        map(response => {
          if (response.sucesso && response.dados) { 
              return new ResponseSucesso<MatriculaAlunoDTO>(response.dados, response.mensagem);
          }
          
          return new ResponseErro<MatriculaAlunoDTO | null>(response.dados, response.mensagem);
        }),
        catchError(error => {
          console.error('Erro na verificação de CPF:', error);
          return of(new ResponseErro<MatriculaAlunoDTO | null>(null, 'Erro ao verificar CPF.'));
        })
      );
    }
    
    GetMatriculas() : Observable<Response<MatriculaViewModel[]>> {
      return this.http.get<Response<MatriculaResponseDTO[]>>(this.apiUrl).pipe(
        map(response =>{
          if(response.sucesso && response.dados){
              const matriculaViewModel = response.dados.map(dto => this.mapMatriculaResponseToViewModel(dto));
              return new ResponseSucesso<MatriculaViewModel[]>(matriculaViewModel, response.mensagem);
          } else {
              const matriculaViewModel = response.dados?.map(dto => this.mapMatriculaResponseToViewModel(dto)) ?? [];
              return new ResponseErro<MatriculaViewModel[]>(matriculaViewModel, response.mensagem);
          }
        }),
        catchError(error => {
          console.error('Erro na requisição:', error);
          return of(new ResponseErro<MatriculaViewModel[]>([], 'Erro na requisição.'));
        })
      );
    }        
    
    CreateMatricula(matricula: MatriculaCreateDTO ): Observable<Response<MatriculaViewModel>> {
      return this.http.post<Response<MatriculaResponseDTO>>(this.apiUrl, matricula).pipe(
        map(response =>{
          if(response.sucesso && response.dados){
            const matriculaViewModel = this.mapMatriculaResponseToViewModel(response.dados);
            return new ResponseSucesso<MatriculaViewModel>(matriculaViewModel, response.mensagem);
          } else {
            return new ResponseErro<MatriculaViewModel>(null, response.mensagem || 'Erro ao criar matrícula.');
          }
        }),
        catchError(error => {
          console.error('Erro na requisição:', error);
          return of(new ResponseErro<MatriculaViewModel>(null, 'Erro na requisição ao criar matrícula.'));
        })
      );
    }

    EditarMatricula(id : number, matricula: MatriculaUpdateDTO): Observable<Response<MatriculaViewModel>> {
      return this.http.patch<Response<MatriculaResponseDTO>>(`${this.apiUrl}/${id}`, matricula).pipe(
        map(response =>{
          if(response.sucesso && response.dados){
              const matriculaViewModel = this.mapMatriculaResponseToViewModel(response.dados);
              return new ResponseSucesso<MatriculaViewModel>(matriculaViewModel, response.mensagem);
          } else {
              return new ResponseErro<MatriculaViewModel>(null, response.mensagem);
          }
        }),
        catchError(error => {
          console.error('Erro na requisição:', error);
          return of(new ResponseErro<MatriculaViewModel>(null, 'Erro na requisição.'));
        })
      );
    }

    InativaMatricula(id : number): Observable<Response<MatriculaViewModel>> {
      return this.http.put<Response<MatriculaResponseDTO>>(`${this.apiUrl}/mudar-status/${id}`, id).pipe(
        map(response =>{
          if(response.sucesso && response.dados){
              const matriculaViewModel = this.mapMatriculaResponseToViewModel(response.dados);
              return new ResponseSucesso<MatriculaViewModel>(matriculaViewModel, response.mensagem);
          } else {
              return new ResponseErro<MatriculaViewModel>(null, response.mensagem);
          }
        }),
        catchError(error => {
          console.error('Erro na requisição:', error);
          return of(new ResponseErro<MatriculaViewModel>(null, 'Erro na requisição.'));
        })
      );
    }
}
