using backend_sc.DTOs.PagamentoDTO;
using backend_sc.Models;

namespace backend_sc.Services.PagamentoService
{
    public interface IPagamentoInterface
    {
        Task<ServiceResponse<List<PagamentoResponseDTO>>> GetPagamentos();
        Task<ServiceResponse<PagamentoResponseDTO>> CreatePagamento(PagamentoCreateDTO newPagamento);
        Task<ServiceResponse<PagamentoResponseDTO>> GetPagamentoById(int id);
        Task<ServiceResponse<PagamentoResponseDTO>> GetPagamentoByAlunoId(int alunoId);
        Task<ServiceResponse<PagamentoResponseDTO>> UpdatePagamento(int id, PagamentoUpdateDTO editPagamento);
        Task<ServiceResponse<bool>> DeletePagamento(int id);
        Task<ServiceResponse<PagamentoResponseDTO>> CancelarPagamento(int id);
        Task<ServiceResponse<List<PagamentoResponseDTO>>> GetPagamentosPorStatus(string status);
        Task<ServiceResponse<List<PagamentoResponseDTO>>> GetPagamentosVencidos();
    }
}
