export interface ParcelaViewModel {
  id: number
  numeroParcela: number
  valor: number
  valorFormatado: string
  statusParcela: string
  dataVencimento: string
  dataPagamento?: string | null
  valorPago?: number
  valorPagoFormatado?: string | null
  juros: number
  jurosFormatado: string
  multa: number
  multaFormatada: string
  observacao?: string
  pagamentoId: number
  dataCriacao: string
  dataAtualizacao?: string | null
  diasAtraso: number
  valorTotal: number
  valorTotalFormatado: string
  estaVencida: boolean
}
