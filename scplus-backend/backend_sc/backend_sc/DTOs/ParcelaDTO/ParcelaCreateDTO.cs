using System.ComponentModel.DataAnnotations;

namespace backend_sc.DTOs.ParcelaDTO
{
    public class ParcelaCreateDTO
    {
        [Required]
        public int NumeroParcela { get; set; }

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "O valor deve ser maior que zero")]
        public decimal Valor { get; set; }

        [Required]
        public DateTime DataVencimento { get; set; }

        public decimal? Juros { get; set; } = 0;

        public decimal? Multa { get; set; } = 0;

        [MaxLength(200)]
        public string Observacao { get; set; }

        [Required]
        public int PagamentoId { get; set; }
    }
}
