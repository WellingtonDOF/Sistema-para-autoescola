using backend_sc.DTOs.ParcelaDTO;

namespace backend_sc.DTOs.PagamentoDTO
{
    public class PagamentoResponseDTO
    {
        public int Id { get; set; }
        public decimal ValorTotal { get; set; }
        public DateTime DataPagamento { get; set; }
        public string StatusPagamento { get; set; }
        public string FormaPagamento { get; set; }
        public string Descricao { get; set; }
        public int AlunoId { get; set; }
        public string NomeAluno { get; set; }
        public string CpfAluno { get; set; }
        public DateTime DataCriacao { get; set; }
        public DateTime? DataAtualizacao { get; set; }

        // Resumo das parcelas
        public int TotalParcelas { get; set; }
        public int ParcelasPagas { get; set; }
        public int ParcelasPendentes { get; set; }
        public int ParcelasVencidas { get; set; }
        public decimal ValorPago { get; set; }
        public decimal ValorPendente { get; set; }

        public List<ParcelaResponseDTO> Parcelas { get; set; } = new List<ParcelaResponseDTO>();
    }
}
