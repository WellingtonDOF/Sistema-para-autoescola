using backend_sc.DTOs.PessoaDTO;
using System.ComponentModel.DataAnnotations;

namespace backend_sc.DTOs.InstrutorDTO
{
    public class InstrutorUpdateDTO : PessoaUpdateDTO
    {
        [Required]
        [MaxLength(22)]
        public string CategoriaCnh { get; set; }
    }
}
