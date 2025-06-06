using backend_sc.DTOs.AulaDTO;
using backend_sc.Models;
using backend_sc.Services.AulaService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend_sc.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Policy = "InstrutorOrAdmin")]
    public class AulaController : ControllerBase
    {
        private readonly IAulaInterface _aulaInterface;
        public AulaController(IAulaInterface aulaInterface)
        {
            _aulaInterface = aulaInterface;
        }

        [HttpGet]
        public async Task<ActionResult<ServiceResponse<List<AulaResponseDTO>>>> GetAulas()
        {
            return Ok(await _aulaInterface.GetAulas());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ServiceResponse<AulaResponseDTO>>> GetAulasById(int id)
        {
            return Ok(await _aulaInterface.GetAulaById(id));
        }

        [HttpPatch("{id}")]
        public async Task<ActionResult<ServiceResponse<AulaResponseDTO>>> UpdateAula(int id, [FromBody] AulaUpdateDTO editAula)
        {
            return Ok(await _aulaInterface.UpdateAula(id, editAula));
        }
    }
}
