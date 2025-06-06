using backend_sc.DTOs.ParcelaDTO;
using backend_sc.Models;

namespace backend_sc.Services.ParcelaService
{
    public interface IParcelaInterface
    {
        Task<ServiceResponse<List<ParcelaResponseDTO>>> GetParcelas();
        Task<ServiceResponse<ParcelaResponseDTO>> CreateParcela(ParcelaCreateDTO newParcela);
        Task<ServiceResponse<ParcelaResponseDTO>> GetParcelaById(int id);
        Task<ServiceResponse<List<ParcelaResponseDTO>>> GetParcelasByPagamentoId(int pagamentoId);
        Task<ServiceResponse<ParcelaResponseDTO>> UpdateParcela(int id, ParcelaUpdateDTO editParcela);
        Task<ServiceResponse<bool>> DeleteParcela(int id);
        Task<ServiceResponse<ParcelaResponseDTO>> MarcarComoPaga(int id, decimal? valorPago = null);
        Task<ServiceResponse<List<ParcelaResponseDTO>>> GetParcelasVencidas();
        Task<ServiceResponse<List<ParcelaResponseDTO>>> GetParcelasVencendoEm(int dias);
    }
}
