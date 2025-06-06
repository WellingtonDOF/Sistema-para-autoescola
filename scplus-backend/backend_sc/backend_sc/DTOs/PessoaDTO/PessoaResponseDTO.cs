using backend_sc.Enums;
using System.ComponentModel.DataAnnotations;

namespace backend_sc.DTOs.PessoaDTO
{
    public class PessoaResponseDTO
    {
        public int Id { get; set; }
        public string NomeCompleto { get; set; }
        public string Cpf { get; set; }
        public string Endereco { get; set; }
        public string Telefone { get; set; }
        public string Email { get; set; }
        public DateTime DataNascimento { get; set; }
        public string TipoUsuario { get; set; }
        public string Status { get; set; }
    }
}
