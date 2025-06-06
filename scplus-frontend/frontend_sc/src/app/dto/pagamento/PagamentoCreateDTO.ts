export interface PagamentoCreateDTO {
  valorTotal: number
  formaPagamento: string
  descricao?: string
  alunoId: number
  quantidadeParcelas?: number
  dataPrimeiraParcela?: string
  intervaloEntreParcelas?: number
}
