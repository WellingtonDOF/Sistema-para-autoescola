
using backend_sc.DTOs.LoginDTO;
using backend_sc.Models;

namespace backend_sc.Services.AuthService
{
    public interface IAuthInterface
    {
        Task<ServiceResponse<LoginResponseDTO>> LoginAsync(LoginDTO loginDto);
        string GerarToken(PessoaModel usuario);
        bool VerificarSenha(string senha, string hash);
    }
}