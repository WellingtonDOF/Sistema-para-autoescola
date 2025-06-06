using System.ComponentModel.DataAnnotations;

namespace backend_sc.DTOs.PagamentoDTO
{
    public class PagamentoCreateDTO
    {
        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "O valor total deve ser maior que zero")]
        public decimal ValorTotal { get; set; }

        [Required]
        [MaxLength(50)]
        public string FormaPagamento { get; set; }

        [MaxLength(500)]
        public string Descricao { get; set; }

        [Required]
        public int AlunoId { get; set; }

        // Para pagamentos parcelados
        public int? QuantidadeParcelas { get; set; }

        public DateTime? DataPrimeiraParcela { get; set; }

        public int? IntervaloEntreParcelas { get; set; } = 30; // dias
    }
}
