using System.ComponentModel.DataAnnotations;

namespace backend_sc.DTOs.PagamentoDTO
{
    public class PagamentoUpdateDTO
    {
        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "O valor total deve ser maior que zero")]
        public decimal ValorTotal { get; set; }

        [Required]
        [MaxLength(50)]
        public string FormaPagamento { get; set; }

        [MaxLength(500)]
        public string Descricao { get; set; }
    }
}
