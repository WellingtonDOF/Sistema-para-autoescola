using backend_sc.DTOs.PessoaDTO;
using backend_sc.Enums;
using backend_sc.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace backend_sc.DTOs.AlunoDTO
{
    public class AlunoCreateDTO : PessoaCreateDTO
    {
        [MaxLength(500)]
        public string Observacao { get; set; }
    }
}
