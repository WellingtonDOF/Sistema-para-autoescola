using backend_sc.DTOs.MatriculaDTO;
using backend_sc.Models;
using backend_sc.Services.MatriculaService;
using backend_sc.Services.PessoaService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend_sc.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Policy ="AdminOnly")] // ativando a segurança, qualquer um com JWT acessa esse controller!

    public class MatriculaController : ControllerBase
    {
        private readonly IMatriculaInterface _matriculaInterface;
        public MatriculaController(IMatriculaInterface matriculaInterface)
        {
            _matriculaInterface = matriculaInterface;
        }

        [HttpGet]
        [Authorize(Policy = "AdminOnly")] 
        public async Task<ActionResult<ServiceResponse<List<MatriculaResponseDTO>>>> GetMatriculas()
        {
            return Ok(await _matriculaInterface.GetMatriculas());
        }

        [HttpGet("{id}")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<ActionResult<ServiceResponse<MatriculaResponseDTO>>> GetMatriculaById(int id)
        {
            return Ok(await _matriculaInterface.GetMatriculaById(id));
        }

        [HttpPost]
        [Authorize(Policy = "AdminOnly")] 
        public async Task<ActionResult<ServiceResponse<MatriculaResponseDTO>>> CreateMatricula(MatriculaCreateDTO newMatricula)
        {
            return Ok(await _matriculaInterface.CreateMatricula(newMatricula));
        }

        [HttpGet("verificar-cpf/{cpf}")]
        [Authorize(Policy = "AdminOnly")] 
        public async Task<ActionResult<ServiceResponse<AlunoParaMatriculaDTO>>> VerificarCpfExistente(string cpf)
        {
            return Ok(await _matriculaInterface.VerificarCpfExistente(cpf));
        }

        [HttpPut("mudar-status/{id}")]
        [Authorize(Policy = "AdminOnly")] 
        public async Task<ActionResult<ServiceResponse<MatriculaResponseDTO>>> MudarStatusMatricula(int id)
        {
            return Ok(await _matriculaInterface.MudarStatusMatricula(id));
        }

        [HttpPatch("{id}")]
        [Authorize(Policy = "AdminOnly")] 
        public async Task<ActionResult<ServiceResponse<MatriculaResponseDTO>>> UpdateMatricula(int id, [FromBody] MatriculaUpdateDTO editMatricula)
        {
            return Ok(await _matriculaInterface.UpdateMatricula(id, editMatricula));
        }
    }
    
}
