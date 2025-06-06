using backend_sc.DTOs.ParcelaDTO;
using backend_sc.Models;
using backend_sc.Services.ParcelaService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend_sc.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize(Policy = "InstrutorOrAdmin")]
    public class ParcelaController : ControllerBase
    {
        private readonly IParcelaInterface _parcelaInterface;

        public ParcelaController(IParcelaInterface parcelaInterface)
        {
            _parcelaInterface = parcelaInterface;
        }

        [HttpGet]
        public async Task<ActionResult<ServiceResponse<List<ParcelaResponseDTO>>>> GetParcelas()
        {
            return Ok(await _parcelaInterface.GetParcelas());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ServiceResponse<ParcelaResponseDTO>>> GetParcelaById(int id)
        {
            return Ok(await _parcelaInterface.GetParcelaById(id));
        }

        [HttpGet("pagamento/{pagamentoId}")]
        public async Task<ActionResult<ServiceResponse<List<ParcelaResponseDTO>>>> GetParcelasByPagamentoId(int pagamentoId)
        {
            return Ok(await _parcelaInterface.GetParcelasByPagamentoId(pagamentoId));
        }

        [HttpGet("vencidas")]
        public async Task<ActionResult<ServiceResponse<List<ParcelaResponseDTO>>>> GetParcelasVencidas()
        {
            return Ok(await _parcelaInterface.GetParcelasVencidas());
        }

        [HttpGet("vencendo-em/{dias}")]
        public async Task<ActionResult<ServiceResponse<List<ParcelaResponseDTO>>>> GetParcelasVencendoEm(int dias)
        {
            return Ok(await _parcelaInterface.GetParcelasVencendoEm(dias));
        }

        [HttpPost]
        public async Task<ActionResult<ServiceResponse<ParcelaResponseDTO>>> CreateParcela(ParcelaCreateDTO newParcela)
        {
            return Ok(await _parcelaInterface.CreateParcela(newParcela));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ServiceResponse<ParcelaResponseDTO>>> UpdateParcela(int id, [FromBody] ParcelaUpdateDTO editParcela)
        {
            return Ok(await _parcelaInterface.UpdateParcela(id, editParcela));
        }

        [HttpPatch("marcar-paga/{id}")]
        public async Task<ActionResult<ServiceResponse<ParcelaResponseDTO>>> MarcarComoPaga(int id, [FromQuery] decimal? valorPago = null)
        {
            return Ok(await _parcelaInterface.MarcarComoPaga(id, valorPago));
        }
    }
}
