import { Injectable } from "@angular/core"
import { environment } from "../../environments/environment.development"
import { HttpClient } from "@angular/common/http"
import type { PagamentoResponseDTO } from "../dto/pagamento/PagamentoResponseDTO"
import type { Response } from "../models/Response"
import { type Observable, of } from "rxjs"
import type { PagamentoViewModel } from "../models/PagamentoViewModel"
import { catchError, map } from "rxjs/operators"
import { ResponseSucesso } from "../models/ResponseSucesso"
import { ResponseErro } from "../models/ResponseErro"
import type { PagamentoCreateDTO } from "../dto/pagamento/PagamentoCreateDTO"
import type { PagamentoUpdateDTO } from "../dto/pagamento/PagamentoUpdateDTO"

@Injectable({
  providedIn: "root",
})
export class PagamentoService {
  private apiUrl = `${environment.ApiUrl}/pagamento`

  constructor(private http: HttpClient) {}

  private formatarValor(valor: number): string {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor)
  }

  private formatarData(data: string): string {
    return new Date(data).toLocaleDateString("pt-BR")
  }

  private mapPagamentoResponseToViewModel(pagamentoResponse: PagamentoResponseDTO): PagamentoViewModel {
    return {
      id: pagamentoResponse.id,
      valorTotal: pagamentoResponse.valorTotal,
      valorTotalFormatado: this.formatarValor(pagamentoResponse.valorTotal),
      dataPagamento: this.formatarData(pagamentoResponse.dataPagamento),
      statusPagamento: pagamentoResponse.statusPagamento,
      formaPagamento: pagamentoResponse.formaPagamento,
      descricao: pagamentoResponse.descricao,
      alunoId: pagamentoResponse.alunoId,
      nomeAluno: pagamentoResponse.nomeAluno,
      cpfAluno: pagamentoResponse.cpfAluno,
      dataCriacao: this.formatarData(pagamentoResponse.dataCriacao),
      dataAtualizacao: pagamentoResponse.dataAtualizacao ? this.formatarData(pagamentoResponse.dataAtualizacao) : null,
      totalParcelas: pagamentoResponse.totalParcelas,
      parcelasPagas: pagamentoResponse.parcelasPagas,
      parcelasPendentes: pagamentoResponse.parcelasPendentes,
      parcelasVencidas: pagamentoResponse.parcelasVencidas,
      valorPago: pagamentoResponse.valorPago,
      valorPagoFormatado: this.formatarValor(pagamentoResponse.valorPago),
      valorPendente: pagamentoResponse.valorPendente,
      valorPendenteFormatado: this.formatarValor(pagamentoResponse.valorPendente),
      parcelas: pagamentoResponse.parcelas || [],
    }
  }

  GetPagamento(id: number): Observable<Response<PagamentoViewModel>> {
    return this.http.get<Response<PagamentoResponseDTO>>(`${this.apiUrl}/${id}`).pipe(
      map((response) => {
        if (response.sucesso && response.dados) {
          const pagamentoViewModel = this.mapPagamentoResponseToViewModel(response.dados)
          return new ResponseSucesso<PagamentoViewModel>(pagamentoViewModel, response.mensagem)
        } else {
          return new ResponseErro<PagamentoViewModel>(null, response.mensagem)
        }
      }),
      catchError((error) => {
        console.error("Erro na requisição:", error)
        return of(new ResponseErro<PagamentoViewModel>(null, "Erro na requisição."))
      }),
    )
  }

  GetPagamentos(): Observable<Response<PagamentoViewModel[]>> {
    return this.http.get<Response<PagamentoResponseDTO[]>>(this.apiUrl).pipe(
      map((response) => {
        if (response.sucesso && response.dados) {
          const pagamentosViewModel = response.dados.map((dto) => this.mapPagamentoResponseToViewModel(dto))
          return new ResponseSucesso<PagamentoViewModel[]>(pagamentosViewModel, response.mensagem)
        } else {
          const pagamentosViewModel = response.dados?.map((dto) => this.mapPagamentoResponseToViewModel(dto)) ?? []
          return new ResponseErro<PagamentoViewModel[]>(pagamentosViewModel, response.mensagem)
        }
      }),
      catchError((error) => {
        console.error("Erro na requisição:", error)
        return of(new ResponseErro<PagamentoViewModel[]>([], "Erro na requisição."))
      }),
    )
  }

  GetPagamentoByAlunoId(alunoId: number): Observable<Response<PagamentoViewModel>> {
    return this.http.get<Response<PagamentoResponseDTO>>(`${this.apiUrl}/aluno/${alunoId}`).pipe(
      map((response) => {
        if (response.sucesso && response.dados) {
          const pagamentoViewModel = this.mapPagamentoResponseToViewModel(response.dados)
          return new ResponseSucesso<PagamentoViewModel>(pagamentoViewModel, response.mensagem)
        } else {
          return new ResponseErro<PagamentoViewModel>(null, response.mensagem)
        }
      }),
      catchError((error) => {
        console.error("Erro na requisição:", error)
        return of(new ResponseErro<PagamentoViewModel>(null, "Erro na requisição."))
      }),
    )
  }

  GetPagamentosPorStatus(status: string): Observable<Response<PagamentoViewModel[]>> {
    return this.http.get<Response<PagamentoResponseDTO[]>>(`${this.apiUrl}/status/${status}`).pipe(
      map((response) => {
        if (response.sucesso && response.dados) {
          const pagamentosViewModel = response.dados.map((dto) => this.mapPagamentoResponseToViewModel(dto))
          return new ResponseSucesso<PagamentoViewModel[]>(pagamentosViewModel, response.mensagem)
        } else {
          const pagamentosViewModel = response.dados?.map((dto) => this.mapPagamentoResponseToViewModel(dto)) ?? []
          return new ResponseErro<PagamentoViewModel[]>(pagamentosViewModel, response.mensagem)
        }
      }),
      catchError((error) => {
        console.error("Erro na requisição:", error)
        return of(new ResponseErro<PagamentoViewModel[]>([], "Erro na requisição."))
      }),
    )
  }

  GetPagamentosVencidos(): Observable<Response<PagamentoViewModel[]>> {
    return this.http.get<Response<PagamentoResponseDTO[]>>(`${this.apiUrl}/vencidos`).pipe(
      map((response) => {
        if (response.sucesso && response.dados) {
          const pagamentosViewModel = response.dados.map((dto) => this.mapPagamentoResponseToViewModel(dto))
          return new ResponseSucesso<PagamentoViewModel[]>(pagamentosViewModel, response.mensagem)
        } else {
          const pagamentosViewModel = response.dados?.map((dto) => this.mapPagamentoResponseToViewModel(dto)) ?? []
          return new ResponseErro<PagamentoViewModel[]>(pagamentosViewModel, response.mensagem)
        }
      }),
      catchError((error) => {
        console.error("Erro na requisição:", error)
        return of(new ResponseErro<PagamentoViewModel[]>([], "Erro na requisição."))
      }),
    )
  }

  CreatePagamento(pagamento: PagamentoCreateDTO): Observable<Response<PagamentoViewModel>> {
    return this.http.post<Response<PagamentoResponseDTO>>(this.apiUrl, pagamento).pipe(
      map((response) => {
        if (response.sucesso && response.dados) {
          const pagamentoViewModel = this.mapPagamentoResponseToViewModel(response.dados)
          return new ResponseSucesso<PagamentoViewModel>(pagamentoViewModel, response.mensagem)
        } else {
          return new ResponseErro<PagamentoViewModel>(null, response.mensagem || "Erro ao criar pagamento.")
        }
      }),
      catchError((error) => {
        console.error("Erro na requisição:", error)
        return of(new ResponseErro<PagamentoViewModel>(null, "Erro na requisição ao criar pagamento."))
      }),
    )
  }

  EditarPagamento(id: number, pagamento: PagamentoUpdateDTO): Observable<Response<PagamentoViewModel>> {
    return this.http.put<Response<PagamentoResponseDTO>>(`${this.apiUrl}/${id}`, pagamento).pipe(
      map((response) => {
        if (response.sucesso && response.dados) {
          const pagamentoViewModel = this.mapPagamentoResponseToViewModel(response.dados)
          return new ResponseSucesso<PagamentoViewModel>(pagamentoViewModel, response.mensagem)
        } else {
          return new ResponseErro<PagamentoViewModel>(null, response.mensagem)
        }
      }),
      catchError((error) => {
        console.error("Erro na requisição:", error)
        return of(new ResponseErro<PagamentoViewModel>(null, "Erro na requisição."))
      }),
    )
  }

  CancelarPagamento(id: number): Observable<Response<PagamentoViewModel>> {
    return this.http.patch<Response<PagamentoResponseDTO>>(`${this.apiUrl}/cancelar/${id}`, {}).pipe(
      map((response) => {
        if (response.sucesso && response.dados) {
          const pagamentoViewModel = this.mapPagamentoResponseToViewModel(response.dados)
          return new ResponseSucesso<PagamentoViewModel>(pagamentoViewModel, response.mensagem)
        } else {
          return new ResponseErro<PagamentoViewModel>(null, response.mensagem)
        }
      }),
      catchError((error) => {
        console.error("Erro na requisição:", error)
        return of(new ResponseErro<PagamentoViewModel>(null, "Erro na requisição."))
      }),
    )
  }
}
