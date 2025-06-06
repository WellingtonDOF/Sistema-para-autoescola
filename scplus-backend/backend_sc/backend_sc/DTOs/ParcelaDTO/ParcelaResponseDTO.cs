namespace backend_sc.DTOs.ParcelaDTO
{
    public class ParcelaResponseDTO
    {
        public int Id { get; set; }
        public int NumeroParcela { get; set; }
        public decimal Valor { get; set; }
        public string StatusParcela { get; set; }
        public DateTime DataVencimento { get; set; }
        public DateTime? DataPagamento { get; set; }
        public decimal? ValorPago { get; set; }
        public decimal? Juros { get; set; }
        public decimal? Multa { get; set; }
        public string Observacao { get; set; }
        public int PagamentoId { get; set; }
        public DateTime DataCriacao { get; set; }
        public DateTime? DataAtualizacao { get; set; }

        // Campos calculados
        public int DiasAtraso { get; set; }
        public decimal ValorTotal { get; set; } // Valor + Juros + Multa
        public bool EstaVencida { get; set; }
    }
}
