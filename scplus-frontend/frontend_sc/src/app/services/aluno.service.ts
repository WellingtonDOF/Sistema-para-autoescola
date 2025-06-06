import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { AlunoResponseDTO } from '../dto/aluno/AlunoResponseDTO';
import { Response } from '../models/Response';
import { Observable, of } from 'rxjs';
import { AlunoViewModel } from '../models/AlunoViewModel';
import { catchError, map } from 'rxjs/operators';
import { ResponseSucesso } from '../models/ResponseSucesso';
import { ResponseErro } from '../models/ResponseErro';
import { AlunoCreateDTO } from '../dto/aluno/AlunoCreateDTO';
import { AlunoUpdateDTO } from '../dto/aluno/AlunoUpdateDTO';

@Injectable({
  providedIn: 'root'
})
export class AlunoService {

  private apiUrl = `${environment.ApiUrl}/aluno`; // URL da API
  private urlVerificaCpf = `${environment.ApiUrl}/pessoa`; // URL da API para verificar CPF

  constructor(private http: HttpClient) { }

  private formatarCPF(cpf: string): string {
    if (!cpf) {
      return '';
    }
    const cleanedCpf = cpf.replace(/\D/g, '');
    const formattedCpf = cleanedCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    return formattedCpf;
  }

  private mapAlunoResponseToViewModel(alunoResponse: AlunoResponseDTO): AlunoViewModel {
    return {
        id: alunoResponse.id,
        nomeCompleto: alunoResponse.nomeCompleto, 
        cpf: this.formatarCPF(alunoResponse.cpf), // Chama a função dentro do serviço
        endereco: alunoResponse.endereco,
        telefone: alunoResponse.telefone,
        email: alunoResponse.email,
        dataNascimento: alunoResponse.dataNascimento, 
        tipoUsuario: alunoResponse.tipoUsuario,
        status: alunoResponse.status,
        observacao: alunoResponse.observacao,
        statusPagamento: alunoResponse.statusPagamento,
        statusCurso: alunoResponse.statusCurso
      };
    }

    GetAluno(id : number) : Observable<Response<AlunoViewModel>> {
      return this.http.get<Response<AlunoResponseDTO>>(`${this.apiUrl}/${id}`).pipe(
        map(response =>{
          if(response.sucesso && response.dados){
              const alunoViewModel = this.mapAlunoResponseToViewModel(response.dados);
              return new ResponseSucesso<AlunoViewModel>(alunoViewModel, response.mensagem);
          } else {
              return new ResponseErro<AlunoViewModel>(null, response.mensagem);
          }
        }),
        catchError(error => {
          console.error('Erro na requisição:', error);
          return of(new ResponseErro<AlunoViewModel>(null, 'Erro na requisição.'));
        })
      );
    }

    VerificarCpfExistente(cpf: string): Observable<Response<boolean>> {
      return this.http.get<Response<boolean>>(`${this.urlVerificaCpf}/verificar-cpf/${cpf}`).pipe(
        map(response => {
          if(response.sucesso) {
            const existe = response.dados ?? false;
            return new ResponseSucesso<boolean>(existe, response.mensagem);
          } else {
            return new ResponseErro<boolean>(false, response.mensagem);
          }
        }),
        catchError(error => {
          console.error('Erro na verificação de CPF:', error);
          return of(new ResponseErro<boolean>(false, 'Erro ao verificar CPF.'));
        })
      );
    }
    
    GetAlunos() : Observable<Response<AlunoViewModel[]>> {
      return this.http.get<Response<AlunoResponseDTO[]>>(this.apiUrl).pipe(
        map(response =>{
          if(response.sucesso && response.dados){
              const alunosViewModel = response.dados.map(dto => this.mapAlunoResponseToViewModel(dto));
              return new ResponseSucesso<AlunoViewModel[]>(alunosViewModel, response.mensagem);
          } else {
              const alunosViewModel = response.dados?.map(dto => this.mapAlunoResponseToViewModel(dto)) ?? [];
              return new ResponseErro<AlunoViewModel[]>(alunosViewModel, response.mensagem);
          }
        }),
        catchError(error => {
          console.error('Erro na requisição:', error);
          return of(new ResponseErro<AlunoViewModel[]>([], 'Erro na requisição.'));
        })
      );
    }        
    
    CreateAluno(aluno: AlunoCreateDTO ): Observable<Response<AlunoViewModel>> {
      return this.http.post<Response<AlunoResponseDTO>>(this.apiUrl, aluno).pipe(
        map(response =>{
          if(response.sucesso && response.dados){
            const alunoViewModel = this.mapAlunoResponseToViewModel(response.dados);
            return new ResponseSucesso<AlunoViewModel>(alunoViewModel, response.mensagem);
          } else {
            return new ResponseErro<AlunoViewModel>(null, response.mensagem || 'Erro ao criar aluno.');
          }
        }),
        catchError(error => {
          console.error('Erro na requisição:', error);
          return of(new ResponseErro<AlunoViewModel>(null, 'Erro na requisição ao criar aluno.'));
        })
      );
    }

    EditarAluno(id : number, aluno: AlunoUpdateDTO): Observable<Response<AlunoViewModel>> {
      return this.http.patch<Response<AlunoResponseDTO>>(`${this.apiUrl}/${id}`, aluno).pipe(
        map(response =>{
          if(response.sucesso && response.dados){
              const alunoViewModel = this.mapAlunoResponseToViewModel(response.dados);
              return new ResponseSucesso<AlunoViewModel>(alunoViewModel, response.mensagem);
          } else {
              return new ResponseErro<AlunoViewModel>(null, response.mensagem);
          }
        }),
        catchError(error => {
          console.error('Erro na requisição:', error);
          return of(new ResponseErro<AlunoViewModel>(null, 'Erro na requisição.'));
        })
      );
    }

    InativaFuncionario(id : number): Observable<Response<AlunoViewModel>> {
      return this.http.put<Response<AlunoResponseDTO>>(`${this.apiUrl}/mudar-status/${id}`, id).pipe(
        map(response =>{
          if(response.sucesso && response.dados){
              const alunoViewModel = this.mapAlunoResponseToViewModel(response.dados);
              return new ResponseSucesso<AlunoViewModel>(alunoViewModel, response.mensagem);
          } else {
              return new ResponseErro<AlunoViewModel>(null, response.mensagem);
          }
        }),
        catchError(error => {
          console.error('Erro na requisição:', error);
          return of(new ResponseErro<AlunoViewModel>(null, 'Erro na requisição.'));
        })
      );
    }
}
