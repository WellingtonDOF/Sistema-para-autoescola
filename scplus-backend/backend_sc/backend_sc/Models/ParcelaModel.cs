using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using backend_sc.Enums;

namespace backend_sc.Models
{
    public class ParcelaModel
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public int NumeroParcela { get; set; }

        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal Valor { get; set; }

        [Required]
        public StatusParcelaEnum StatusParcela { get; set; }

        [Required]
        public DateTime DataVencimento { get; set; }

        public DateTime? DataPagamento { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal? ValorPago { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal? Juros { get; set; } = 0;

        [Column(TypeName = "decimal(10,2)")]
        public decimal? Multa { get; set; } = 0;

        [MaxLength(200)]
        public string? Observacao { get; set; }

        [Required]
        [ForeignKey("Pagamento")]
        public int PagamentoId { get; set; }

        [Required]
        public DateTime DataCriacao { get; set; } = DateTime.Now;

        public DateTime? DataAtualizacao { get; set; }

        // Propriedade de navegação
        public PagamentoModel Pagamento { get; set; }
    }
}
