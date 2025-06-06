using backend_sc.DTOs.PessoaDTO;
using System.ComponentModel.DataAnnotations;

namespace backend_sc.DTOs.AlunoDTO
{
    public class AlunoUpdateDTO : PessoaUpdateDTO
    {
        [MaxLength(500)]
        public string Observacao { get; set; }
    }
}
