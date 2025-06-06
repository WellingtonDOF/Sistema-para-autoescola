using backend_sc.DTOs.PagamentoDTO;
using backend_sc.Models;
using backend_sc.Services.PagamentoService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend_sc.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize(Policy = "InstrutorOrAdmin")]
    public class PagamentoController : ControllerBase
    {
        private readonly IPagamentoInterface _pagamentoInterface;

        public PagamentoController(IPagamentoInterface pagamentoInterface)
        {
            _pagamentoInterface = pagamentoInterface;
        }

        [HttpGet]
        public async Task<ActionResult<ServiceResponse<List<PagamentoResponseDTO>>>> GetPagamentos()
        {
            return Ok(await _pagamentoInterface.GetPagamentos());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ServiceResponse<PagamentoResponseDTO>>> GetPagamentoById(int id)
        {
            return Ok(await _pagamentoInterface.GetPagamentoById(id));
        }

        [HttpGet("aluno/{alunoId}")]
        public async Task<ActionResult<ServiceResponse<PagamentoResponseDTO>>> GetPagamentoByAlunoId(int alunoId)
        {
            return Ok(await _pagamentoInterface.GetPagamentoByAlunoId(alunoId));
        }

        [HttpGet("status/{status}")]
        public async Task<ActionResult<ServiceResponse<List<PagamentoResponseDTO>>>> GetPagamentosPorStatus(string status)
        {
            return Ok(await _pagamentoInterface.GetPagamentosPorStatus(status));
        }

        [HttpGet("vencidos")]
        public async Task<ActionResult<ServiceResponse<List<PagamentoResponseDTO>>>> GetPagamentosVencidos()
        {
            return Ok(await _pagamentoInterface.GetPagamentosVencidos());
        }

        [HttpPost]
        public async Task<ActionResult<ServiceResponse<PagamentoResponseDTO>>> CreatePagamento(PagamentoCreateDTO newPagamento)
        {
            return Ok(await _pagamentoInterface.CreatePagamento(newPagamento));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ServiceResponse<PagamentoResponseDTO>>> UpdatePagamento(int id, [FromBody] PagamentoUpdateDTO editPagamento)
        {
            return Ok(await _pagamentoInterface.UpdatePagamento(id, editPagamento));
        }

        [HttpPatch("cancelar/{id}")]
        public async Task<ActionResult<ServiceResponse<PagamentoResponseDTO>>> CancelarPagamento(int id)
        {
            return Ok(await _pagamentoInterface.CancelarPagamento(id));
        }
    }
}
