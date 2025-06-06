using backend_sc.DTOs.PessoaDTO;
using backend_sc.Mapping;

namespace backend_sc.DTOs.LoginDTO
{
    public class LoginResponseDTO
    {
        public int Id { get; set; }
        public string Token { get; set; }
        public string NomeCompleto { get; set; }
        public string Email { get; set; }
        public string TipoUsuario { get; set; }
    }
}
