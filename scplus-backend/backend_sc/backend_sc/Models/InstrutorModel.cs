using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend_sc.Models
{
    public class InstrutorModel : PessoaModel
    {
        [Required]
        [MaxLength(22)]
        public string CategoriaCnh { get; set; }
        [Required]
        public DateTime DataAdmissao { get; set; }
    }
}
