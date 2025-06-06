import { Injectable } from "@angular/core"
import { environment } from "../../environments/environment.development"
import { HttpClient } from "@angular/common/http"
import type { ParcelaResponseDTO } from "../dto/parcela/ParcelaResponseDTO"
import type { Response } from "../models/Response"
import { type Observable, of } from "rxjs"
import type { ParcelaViewModel } from "../models/ParcelaViewModel"
import { catchError, map } from "rxjs/operators"
import { ResponseSucesso } from "../models/ResponseSucesso"
import { ResponseErro } from "../models/ResponseErro"
import type { ParcelaCreateDTO } from "../dto/parcela/ParcelaCreateDTO"
import type { ParcelaUpdateDTO } from "../dto/parcela/ParcelaUpdateDTO"

@Injectable({
  providedIn: "root",
})
export class ParcelaService {
  private apiUrl = `${environment.ApiUrl}/parcela`

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

  private mapParcelaResponseToViewModel(parcelaResponse: ParcelaResponseDTO): ParcelaViewModel {
    return {
      id: parcelaResponse.id,
      numeroParcela: parcelaResponse.numeroParcela,
      valor: parcelaResponse.valor,
      valorFormatado: this.formatarValor(parcelaResponse.valor),
      statusParcela: parcelaResponse.statusParcela,
      dataVencimento: this.formatarData(parcelaResponse.dataVencimento),
      dataPagamento: parcelaResponse.dataPagamento ? this.formatarData(parcelaResponse.dataPagamento) : null,
      valorPago: parcelaResponse.valorPago,
      valorPagoFormatado: parcelaResponse.valorPago ? this.formatarValor(parcelaResponse.valorPago) : null,
      juros: parcelaResponse.juros || 0,
      jurosFormatado: this.formatarValor(parcelaResponse.juros || 0),
      multa: parcelaResponse.multa || 0,
      multaFormatada: this.formatarValor(parcelaResponse.multa || 0),
      observacao: parcelaResponse.observacao,
      pagamentoId: parcelaResponse.pagamentoId,
      dataCriacao: this.formatarData(parcelaResponse.dataCriacao),
      dataAtualizacao: parcelaResponse.dataAtualizacao ? this.formatarData(parcelaResponse.dataAtualizacao) : null,
      diasAtraso: parcelaResponse.diasAtraso,
      valorTotal: parcelaResponse.valorTotal,
      valorTotalFormatado: this.formatarValor(parcelaResponse.valorTotal),
      estaVencida: parcelaResponse.estaVencida,
    }
  }

  GetParcela(id: number): Observable<Response<ParcelaViewModel>> {
    return this.http.get<Response<ParcelaResponseDTO>>(`${this.apiUrl}/${id}`).pipe(
      map((response) => {
        if (response.sucesso && response.dados) {
          const parcelaViewModel = this.mapParcelaResponseToViewModel(response.dados)
          return new ResponseSucesso<ParcelaViewModel>(parcelaViewModel, response.mensagem)
        } else {
          return new ResponseErro<ParcelaViewModel>(null, response.mensagem)
        }
      }),
      catchError((error) => {
        console.error("Erro na requisição:", error)
        return of(new ResponseErro<ParcelaViewModel>(null, "Erro na requisição."))
      }),
    )
  }

  GetParcelas(): Observable<Response<ParcelaViewModel[]>> {
    return this.http.get<Response<ParcelaResponseDTO[]>>(this.apiUrl).pipe(
      map((response) => {
        if (response.sucesso && response.dados) {
          const parcelasViewModel = response.dados.map((dto) => this.mapParcelaResponseToViewModel(dto))
          return new ResponseSucesso<ParcelaViewModel[]>(parcelasViewModel, response.mensagem)
        } else {
          const parcelasViewModel = response.dados?.map((dto) => this.mapParcelaResponseToViewModel(dto)) ?? []
          return new ResponseErro<ParcelaViewModel[]>(parcelasViewModel, response.mensagem)
        }
      }),
      catchError((error) => {
        console.error("Erro na requisição:", error)
        return of(new ResponseErro<ParcelaViewModel[]>([], "Erro na requisição."))
      }),
    )
  }

  GetParcelasByPagamentoId(pagamentoId: number): Observable<Response<ParcelaViewModel[]>> {
    return this.http.get<Response<ParcelaResponseDTO[]>>(`${this.apiUrl}/pagamento/${pagamentoId}`).pipe(
      map((response) => {
        if (response.sucesso && response.dados) {
          const parcelasViewModel = response.dados.map((dto) => this.mapParcelaResponseToViewModel(dto))
          return new ResponseSucesso<ParcelaViewModel[]>(parcelasViewModel, response.mensagem)
        } else {
          const parcelasViewModel = response.dados?.map((dto) => this.mapParcelaResponseToViewModel(dto)) ?? []
          return new ResponseErro<ParcelaViewModel[]>(parcelasViewModel, response.mensagem)
        }
      }),
      catchError((error) => {
        console.error("Erro na requisição:", error)
        return of(new ResponseErro<ParcelaViewModel[]>([], "Erro na requisição."))
      }),
    )
  }

  GetParcelasVencidas(): Observable<Response<ParcelaViewModel[]>> {
    return this.http.get<Response<ParcelaResponseDTO[]>>(`${this.apiUrl}/vencidas`).pipe(
      map((response) => {
        if (response.sucesso && response.dados) {
          const parcelasViewModel = response.dados.map((dto) => this.mapParcelaResponseToViewModel(dto))
          return new ResponseSucesso<ParcelaViewModel[]>(parcelasViewModel, response.mensagem)
        } else {
          const parcelasViewModel = response.dados?.map((dto) => this.mapParcelaResponseToViewModel(dto)) ?? []
          return new ResponseErro<ParcelaViewModel[]>(parcelasViewModel, response.mensagem)
        }
      }),
      catchError((error) => {
        console.error("Erro na requisição:", error)
        return of(new ResponseErro<ParcelaViewModel[]>([], "Erro na requisição."))
      }),
    )
  }

  GetParcelasVencendoEm(dias: number): Observable<Response<ParcelaViewModel[]>> {
    return this.http.get<Response<ParcelaResponseDTO[]>>(`${this.apiUrl}/vencendo-em/${dias}`).pipe(
      map((response) => {
        if (response.sucesso && response.dados) {
          const parcelasViewModel = response.dados.map((dto) => this.mapParcelaResponseToViewModel(dto))
          return new ResponseSucesso<ParcelaViewModel[]>(parcelasViewModel, response.mensagem)
        } else {
          const parcelasViewModel = response.dados?.map((dto) => this.mapParcelaResponseToViewModel(dto)) ?? []
          return new ResponseErro<ParcelaViewModel[]>(parcelasViewModel, response.mensagem)
        }
      }),
      catchError((error) => {
        console.error("Erro na requisição:", error)
        return of(new ResponseErro<ParcelaViewModel[]>([], "Erro na requisição."))
      }),
    )
  }

  CreateParcela(parcela: ParcelaCreateDTO): Observable<Response<ParcelaViewModel>> {
    return this.http.post<Response<ParcelaResponseDTO>>(this.apiUrl, parcela).pipe(
      map((response) => {
        if (response.sucesso && response.dados) {
          const parcelaViewModel = this.mapParcelaResponseToViewModel(response.dados)
          return new ResponseSucesso<ParcelaViewModel>(parcelaViewModel, response.mensagem)
        } else {
          return new ResponseErro<ParcelaViewModel>(null, response.mensagem || "Erro ao criar parcela.")
        }
      }),
      catchError((error) => {
        console.error("Erro na requisição:", error)
        return of(new ResponseErro<ParcelaViewModel>(null, "Erro na requisição ao criar parcela."))
      }),
    )
  }

  EditarParcela(id: number, parcela: ParcelaUpdateDTO): Observable<Response<ParcelaViewModel>> {
    return this.http.put<Response<ParcelaResponseDTO>>(`${this.apiUrl}/${id}`, parcela).pipe(
      map((response) => {
        if (response.sucesso && response.dados) {
          const parcelaViewModel = this.mapParcelaResponseToViewModel(response.dados)
          return new ResponseSucesso<ParcelaViewModel>(parcelaViewModel, response.mensagem)
        } else {
          return new ResponseErro<ParcelaViewModel>(null, response.mensagem)
        }
      }),
      catchError((error) => {
        console.error("Erro na requisição:", error)
        return of(new ResponseErro<ParcelaViewModel>(null, "Erro na requisição."))
      }),
    )
  }

  MarcarComoPaga(id: number, valorPago?: number): Observable<Response<ParcelaViewModel>> {
    const params = valorPago ? `?valorPago=${valorPago}` : ""
    return this.http.patch<Response<ParcelaResponseDTO>>(`${this.apiUrl}/marcar-paga/${id}${params}`, {}).pipe(
      map((response) => {
        if (response.sucesso && response.dados) {
          const parcelaViewModel = this.mapParcelaResponseToViewModel(response.dados)
          return new ResponseSucesso<ParcelaViewModel>(parcelaViewModel, response.mensagem)
        } else {
          return new ResponseErro<ParcelaViewModel>(null, response.mensagem)
        }
      }),
      catchError((error) => {
        console.error("Erro na requisição:", error)
        return of(new ResponseErro<ParcelaViewModel>(null, "Erro na requisição."))
      }),
    )
  }
}
