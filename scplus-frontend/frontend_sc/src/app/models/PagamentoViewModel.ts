import type { ParcelaResponseDTO } from "../dto/parcela/ParcelaResponseDTO"

export interface PagamentoViewModel {
  id: number
  valorTotal: number
  valorTotalFormatado: string
  dataPagamento: string
  statusPagamento: string
  formaPagamento: string
  descricao?: string
  alunoId: number
  nomeAluno: string
  cpfAluno: string
  dataCriacao: string
  dataAtualizacao?: string | null
  totalParcelas: number
  parcelasPagas: number
  parcelasPendentes: number
  parcelasVencidas: number
  valorPago: number
  valorPagoFormatado: string
  valorPendente: number
  valorPendenteFormatado: string
  parcelas: ParcelaResponseDTO[]
}
