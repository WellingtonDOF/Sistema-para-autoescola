using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using backend_sc.Enums;

namespace backend_sc.Models
{
    public class MatriculaModel
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [ForeignKey("Aluno")]
        public int AlunoId { get; set; }

        [Required]
        public int QuantidadeAulaTotal { get; set; }

        [Required]
        public DateTime DataInicio { get; set; }

        [Required]
        public DateTime DataFim { get; set; }

        [Required]
        public TipoCategoriaPlano CategoriaPlano { get; set; }

        [Required]
        public bool StatusMatricula { get; set; }

        //Propriedade de navegação
        public AlunoModel Aluno { get; set; }
    }
}
