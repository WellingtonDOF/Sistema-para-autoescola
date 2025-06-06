using backend_sc.DTOs.VeiculoDTO;
using backend_sc.Models;

namespace backend_sc.Services.VeiculoService
{
    public interface IVeiculoInterface
    {
        Task<ServiceResponse<List<VeiculoResponseDTO>>> GetVeiculos();
        Task<ServiceResponse<VeiculoResponseDTO>> CreateVeiculo(VeiculoCreateDTO newVeiculo);
        Task<ServiceResponse<VeiculoResponseDTO>> GetVeiculoById(int id);
        Task<ServiceResponse<VeiculoResponseDTO>> UpdateVeiculo(int id, VeiculoUpdateDTO editVeiculo);
        Task<ServiceResponse<bool>> DeleteVeiculo(int id);
        Task<ServiceResponse<bool>> VerificarPlacaExistente(string placa);
        Task<ServiceResponse<VeiculoResponseDTO>> InativarVeiculo(int id);
    }
}
