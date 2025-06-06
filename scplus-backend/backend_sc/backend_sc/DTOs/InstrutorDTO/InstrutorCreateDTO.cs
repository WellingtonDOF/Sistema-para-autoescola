using backend_sc.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using backend_sc.DTOs.PessoaDTO;

namespace backend_sc.DTOs.InstrutorDTO
{
    public class InstrutorCreateDTO : PessoaCreateDTO
    {
        [Required]
        [MaxLength(22)]
        public string CategoriaCnh { get; set; }

        [Required]
        public DateTime DataAdmissao { get; set; }
    }
}
