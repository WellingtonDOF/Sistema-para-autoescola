using backend_sc.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend_sc.Models
{
    public class AlunoModel : PessoaModel
    {
        [MaxLength(500)]
        public string Observacao { get; set; }

        [Required]
        public StatusPagamentoEnum StatusPagamento { get; set; }

        [Required]
        public bool StatusCurso { get; set; }
    }
}
