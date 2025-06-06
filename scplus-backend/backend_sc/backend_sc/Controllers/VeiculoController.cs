using backend_sc.DTOs.MatriculaDTO;
using backend_sc.DTOs.VeiculoDTO;
using backend_sc.Models;
using backend_sc.Services.MatriculaService;
using backend_sc.Services.VeiculoService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend_sc.Controllers
{
    [ApiController]
    [Route("api/[Controller]")]
    [Authorize(Policy = "InstrutorOrAdmin")]
    public class VeiculoController : ControllerBase
    {
        private readonly IVeiculoInterface _veiculoInterface;
        public VeiculoController(IVeiculoInterface veiculoInterface)
        {
            _veiculoInterface = veiculoInterface;
        }

        [HttpGet]
        public async Task<ActionResult<ServiceResponse<List<VeiculoResponseDTO>>>> GetVeiculos()
        {
            return Ok(await _veiculoInterface.GetVeiculos());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ServiceResponse<VeiculoResponseDTO>>> GetVeiculoById(int id)
        {
            return Ok(await _veiculoInterface.GetVeiculoById(id));
        }

        [HttpGet("verificar-placa/{placa}")]
        public async Task<ActionResult<bool>> VerificarCpfExistente(string placa)
        {
            return Ok(await _veiculoInterface.VerificarPlacaExistente(placa));
        }

        [HttpPost]
        public async Task<ActionResult<ServiceResponse<VeiculoResponseDTO>>> CreateVeiculo(VeiculoCreateDTO newVeiculo)
        {
            return Ok(await _veiculoInterface.CreateVeiculo(newVeiculo));
        }

        [HttpPut("mudar-status/{id}")]
        public async Task<ActionResult<ServiceResponse<VeiculoResponseDTO>>> InativarVeiculo(int id)
        {
            return Ok(await _veiculoInterface.InativarVeiculo(id));
        }

        [HttpPatch("{id}")]
        public async Task<ActionResult<ServiceResponse<VeiculoResponseDTO>>> UpdateVeiculo(int id, [FromBody] VeiculoUpdateDTO editVeiculo)
        {
            return Ok(await _veiculoInterface.UpdateVeiculo(id, editVeiculo));
        }
    }
}
