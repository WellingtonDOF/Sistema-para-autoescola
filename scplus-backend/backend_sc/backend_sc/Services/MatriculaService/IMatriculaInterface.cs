using backend_sc.DTOs.MatriculaDTO;
using backend_sc.Models;

namespace backend_sc.Services.MatriculaService
{
    public interface IMatriculaInterface
    {
        Task<ServiceResponse<List<MatriculaResponseDTO>>> GetMatriculas();
        Task<ServiceResponse<MatriculaResponseDTO>> CreateMatricula(MatriculaCreateDTO newMatricula);
        Task<ServiceResponse<MatriculaResponseDTO>> GetMatriculaById(int id);
        Task<ServiceResponse<MatriculaResponseDTO>> UpdateMatricula(int id, MatriculaUpdateDTO editMatricula);
        Task<ServiceResponse<bool>> DeleteMatricula(int id);
        Task<ServiceResponse<AlunoParaMatriculaDTO>> VerificarCpfExistente(string cpf);
        Task<ServiceResponse<MatriculaResponseDTO>> MudarStatusMatricula(int id);
    }
}
