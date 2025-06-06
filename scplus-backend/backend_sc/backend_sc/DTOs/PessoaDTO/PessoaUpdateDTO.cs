using System.ComponentModel.DataAnnotations;

namespace backend_sc.DTOs.PessoaDTO
{
    public class PessoaUpdateDTO
    {
        [Required]
        [MaxLength(150)]
        public string NomeCompleto { get; set; }

        [Required]
        [MaxLength(150)]
        public string Endereco { get; set; }

        [Required]
        [Phone]
        [MaxLength(22)]
        public string Telefone { get; set; }


        [Required]
        [EmailAddress]
        [MaxLength(150)]
        public string Email { get; set; }

        public string Senha { get; set; }
    }
}
