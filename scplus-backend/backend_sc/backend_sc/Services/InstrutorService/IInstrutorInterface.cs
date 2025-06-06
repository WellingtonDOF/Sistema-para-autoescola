using backend_sc.DTOs.InstrutorDTO;
using backend_sc.Models;

namespace backend_sc.Services.InstrutorService
{
    public interface IInstrutorInterface
    {
        Task<ServiceResponse<List<InstrutorResponseDTO>>> GetInstrutores();
        Task<ServiceResponse<InstrutorResponseDTO>> CreateInstrutor(InstrutorCreateDTO newInstrutor);
        Task<ServiceResponse<InstrutorResponseDTO>> GetInstrutorById(int id);
        Task<ServiceResponse<InstrutorResponseDTO>> GetInstrutorByCpf(string cpf);
        Task<ServiceResponse<InstrutorResponseDTO>> UpdateInstrutor(int id, InstrutorUpdateDTO editInstrutor);
        Task<ServiceResponse<bool>> DeleteInstrutor(int id);
        Task<ServiceResponse<InstrutorResponseDTO>> MudarStatusInstrutor(int id);
    }
}
