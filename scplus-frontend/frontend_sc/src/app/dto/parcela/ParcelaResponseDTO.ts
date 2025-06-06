export interface ParcelaResponseDTO {
  id: number
  numeroParcela: number
  valor: number
  statusParcela: string
  dataVencimento: string
  dataPagamento?: string
  valorPago?: number
  juros?: number
  multa?: number
  observacao?: string
  pagamentoId: number
  dataCriacao: string
  dataAtualizacao?: string
  diasAtraso: number
  valorTotal: number
  estaVencida: boolean
}
