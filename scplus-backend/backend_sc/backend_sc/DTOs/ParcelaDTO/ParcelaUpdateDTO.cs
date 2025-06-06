using System.ComponentModel.DataAnnotations;

namespace backend_sc.DTOs.ParcelaDTO
{
    public class ParcelaUpdateDTO
    {
        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "O valor deve ser maior que zero")]
        public decimal Valor { get; set; }

        [Required]
        public DateTime DataVencimento { get; set; }

        public decimal? Juros { get; set; }

        public decimal? Multa { get; set; }

        [MaxLength(200)]
        public string Observacao { get; set; }
    }
}
