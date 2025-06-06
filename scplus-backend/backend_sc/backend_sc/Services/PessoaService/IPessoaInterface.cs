using backend_sc.DTOs.PessoaDTO;
using backend_sc.Models;
using Microsoft.EntityFrameworkCore.Storage;

namespace backend_sc.Services.PessoaService
{
    public interface IPessoaInterface
    {
        Task<ServiceResponse<List<PessoaResponseDTO>>> GetPessoas();
        Task<ServiceResponse<PessoaResponseDTO>> CreatePessoa(PessoaCreateDTO newPessoal);
        Task<ServiceResponse<PessoaResponseDTO>> GetPessoaById(int id);
        Task<ServiceResponse<PessoaResponseDTO>> UpdatePessoa(PessoaModel editPessoa);
        Task<ServiceResponse<bool>> DeletePessoa(int id);
        Task<ServiceResponse<bool>> VerificarCpfExistente(string cpf);
        Task<ServiceResponse<PessoaResponseDTO>> InativarPessoa(int id);
    }
}
