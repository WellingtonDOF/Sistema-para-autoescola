export interface ParcelaCreateDTO {
  numeroParcela: number
  valor: number
  dataVencimento: string
  juros?: number
  multa?: number
  observacao?: string
  pagamentoId: number
}
