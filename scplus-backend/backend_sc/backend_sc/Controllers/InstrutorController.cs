using backend_sc.DTOs.AlunoDTO;
using backend_sc.DTOs.InstrutorDTO;
using backend_sc.Models;
using backend_sc.Services.AlunoService;
using backend_sc.Services.InstrutorService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend_sc.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Policy = "AdminOnly")]
    public class InstrutorController : ControllerBase
    {
        private readonly IInstrutorInterface _instrutorInterface;
        public InstrutorController(IInstrutorInterface instrutorInterface)
        {
            _instrutorInterface = instrutorInterface;
        }

        [HttpGet]
        public async Task<ActionResult<ServiceResponse<List<InstrutorResponseDTO>>>> GetInstrutores()
        {
            return Ok(await _instrutorInterface.GetInstrutores());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ServiceResponse<InstrutorResponseDTO>>> GetInstrutorById(int id)
        {
            return Ok(await _instrutorInterface.GetInstrutorById(id));
        }

        [HttpGet("cpf/{cpf}")]
        public async Task<ActionResult<ServiceResponse<InstrutorResponseDTO>>> GetInstrutorByCpf(string cpf)
        {
            return Ok(await _instrutorInterface.GetInstrutorByCpf(cpf));
        }

        [HttpPost]
        public async Task<ActionResult<ServiceResponse<InstrutorResponseDTO>>> CreateInstrutor(InstrutorCreateDTO newInstrutor)
        {
            return Ok(await _instrutorInterface.CreateInstrutor(newInstrutor));
        }

        [HttpPut("mudar-status/{id}")]
        public async Task<ActionResult<ServiceResponse<InstrutorResponseDTO>>> MudarStatusInstrutor(int id)
        {
            return Ok(await _instrutorInterface.MudarStatusInstrutor(id));
        }

        [HttpPatch("{id}")]
        public async Task<ActionResult<ServiceResponse<InstrutorUpdateDTO>>> UpdateInstrutor(int id, [FromBody] InstrutorUpdateDTO editInstrutor)
        {
            return Ok(await _instrutorInterface.UpdateInstrutor(id, editInstrutor));
        }
    }
}
