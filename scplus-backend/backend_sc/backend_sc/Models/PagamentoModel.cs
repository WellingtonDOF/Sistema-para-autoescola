using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using backend_sc.Enums;

namespace backend_sc.Models
{
    public class PagamentoModel
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal ValorTotal { get; set; }

        [Required]
        public DateTime DataPagamento { get; set; }

        [Required]
        public StatusPagamentoEnum StatusPagamento { get; set; }

        [Required]
        [MaxLength(50)]
        public string FormaPagamento { get; set; }

        [MaxLength(500)]
        public string Descricao { get; set; }

        [Required]
        [ForeignKey("Aluno")]
        public int AlunoId { get; set; }

        [Required]
        public DateTime DataCriacao { get; set; } = DateTime.Now;

        public DateTime? DataAtualizacao { get; set; }

        // Propriedade de navegação
        public AlunoModel Aluno { get; set; }
        public ICollection<ParcelaModel> Parcelas { get; set; } = new List<ParcelaModel>();
    }
}
