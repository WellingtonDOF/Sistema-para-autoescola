import type { ParcelaResponseDTO } from "../parcela/ParcelaResponseDTO"

export interface PagamentoResponseDTO {
  id: number
  valorTotal: number
  dataPagamento: string
  statusPagamento: string
  formaPagamento: string
  descricao?: string
  alunoId: number
  nomeAluno: string
  cpfAluno: string
  dataCriacao: string
  dataAtualizacao?: string
  totalParcelas: number
  parcelasPagas: number
  parcelasPendentes: number
  parcelasVencidas: number
  valorPago: number
  valorPendente: number
  parcelas: ParcelaResponseDTO[]
}
