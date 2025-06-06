import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { InstrutorResponseDTO } from '../dto/instrutor/InstrutorResponseDTO';
import { Response } from '../models/Response';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ResponseSucesso } from '../models/ResponseSucesso';
import { ResponseErro } from '../models/ResponseErro';
import { InstrutorCreateDTO } from '../dto/instrutor/InstrutorCreateDTO';
import { InstrutorUpdateDTO } from '../dto/instrutor/InstrutorUpdateDTO';
import { InstrutorViewModel } from '../models/InstrutorViewModel';

@Injectable({
  providedIn: 'root'
})

export class InstrutorService {

  private apiUrl = `${environment.ApiUrl}/instrutor`; // URL da API
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

  private mapInstrutorResponseToViewModel(instrutorResponse: InstrutorResponseDTO): InstrutorViewModel {
    return {
        id: instrutorResponse.id,
        nomeCompleto: instrutorResponse.nomeCompleto, 
        cpf: this.formatarCPF(instrutorResponse.cpf), 
        endereco: instrutorResponse.endereco,
        telefone: instrutorResponse.telefone,
        email: instrutorResponse.email,
        dataNascimento: instrutorResponse.dataNascimento, 
        tipoUsuario: instrutorResponse.tipoUsuario,
        status: instrutorResponse.status,
        categoriaCnh: instrutorResponse.categoriaCnh,
        dataAdmissao: instrutorResponse.dataAdmissao,
      };
    }

    GetInstrutor(id : number) : Observable<Response<InstrutorViewModel>> {
      return this.http.get<Response<InstrutorResponseDTO>>(`${this.apiUrl}/${id}`).pipe(
        map(response =>{
          if(response.sucesso && response.dados){
              const instrutorViewModel = this.mapInstrutorResponseToViewModel(response.dados);
              return new ResponseSucesso<InstrutorViewModel>(instrutorViewModel, response.mensagem);
          } else {
              return new ResponseErro<InstrutorViewModel>(null, response.mensagem);
          }
        }),
        catchError(error => {
          console.error('Erro na requisição:', error);
          return of(new ResponseErro<InstrutorViewModel>(null, 'Erro na requisição.'));
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
    
    GetInstrutores(): Observable<Response<InstrutorViewModel[]>> { 
      return this.http.get<Response<InstrutorResponseDTO[]>>(this.apiUrl).pipe( 
        map(response => {
          if (response.sucesso && response.dados) {
            const instrutoresViewModel = response.dados.map(dto => this.mapInstrutorResponseToViewModel(dto)); // Renomeado para instrutoresViewModel
            return new ResponseSucesso<InstrutorViewModel[]>(instrutoresViewModel, response.mensagem); // Renomeado para instrutoresViewModel
          } else {
            const instrutoresViewModel = response.dados?.map(dto => this.mapInstrutorResponseToViewModel(dto)) ?? [];  // Renomeado para instrutoresViewModel
            return new ResponseErro<InstrutorViewModel[]>(instrutoresViewModel, response.mensagem); // Renomeado para instrutoresViewModel
          }
        }),
        catchError(error => {
          console.error('Erro na requisição:', error);
          return of(new ResponseErro<InstrutorViewModel[]>([], 'Erro na requisição.'));
        })
      );
    }

    CreateInstrutor(instrutor: InstrutorCreateDTO): Observable<Response<InstrutorViewModel>> { 
      return this.http.post<Response<InstrutorResponseDTO>>(this.apiUrl, instrutor).pipe( 
        map(response => {
          if (response.sucesso && response.dados) {
            const instrutorViewModel = this.mapInstrutorResponseToViewModel(response.dados); 
            return new ResponseSucesso<InstrutorViewModel>(instrutorViewModel, response.mensagem); 
          } else {
            return new ResponseErro<InstrutorViewModel>(null, response.mensagem || 'Erro ao criar instrutor.');
          }
        }),
        catchError(error => {
          console.error('Erro na requisição:', error);
          return of(new ResponseErro<InstrutorViewModel>(null, 'Erro na requisição ao criar instrutor.')); 
        })
      );
    }

    EditarInstrutor(id : number, instrutor: InstrutorUpdateDTO): Observable<Response<InstrutorViewModel>> {
      return this.http.patch<Response<InstrutorResponseDTO>>(`${this.apiUrl}/${id}`, instrutor).pipe(
        map(response =>{
          if(response.sucesso && response.dados){
              const instrutorViewModel = this.mapInstrutorResponseToViewModel(response.dados);
              return new ResponseSucesso<InstrutorViewModel>(instrutorViewModel, response.mensagem);
          } else {
              return new ResponseErro<InstrutorViewModel>(null, response.mensagem);
          }
        }),
        catchError(error => {
          console.error('Erro na requisição:', error);
          return of(new ResponseErro<InstrutorViewModel>(null, 'Erro na requisição.'));
        })
      );
    }

    InativaFuncionario(id : number): Observable<Response<InstrutorViewModel>> {
      return this.http.put<Response<InstrutorResponseDTO>>(`${this.apiUrl}/mudar-status/${id}`, id).pipe(
        map(response =>{
          if(response.sucesso && response.dados){
              const instrutorViewModel = this.mapInstrutorResponseToViewModel(response.dados);
              return new ResponseSucesso<InstrutorViewModel>(instrutorViewModel, response.mensagem);
          } else {
              return new ResponseErro<InstrutorViewModel>(null, response.mensagem);
          }
        }),
        catchError(error => {
          console.error('Erro na requisição:', error);
          return of(new ResponseErro<InstrutorViewModel>(null, 'Erro na requisição.'));
        })
      );
    }
}
