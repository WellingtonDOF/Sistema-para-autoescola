using AutoMapper;
using backend_sc.DataContext;
using backend_sc.DTOs.AlunoDTO;
using backend_sc.DTOs.AulaDTO;
using backend_sc.Enums;
using backend_sc.Models;
using Microsoft.EntityFrameworkCore;

namespace backend_sc.Services.AulaService
{
    public class AulaService : IAulaInterface
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public AulaService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public Task<ServiceResponse<bool>> DeleteAula(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<ServiceResponse<AulaResponseDTO>> GetAulaById(int id)
        {
            ServiceResponse<AulaResponseDTO> serviceResponse = new ServiceResponse<AulaResponseDTO>();

            try
            {
                var aulaMapeada = await _context.Aula
                    .FirstOrDefaultAsync(p => p.Id == id);

                if (aulaMapeada == null)
                {
                    serviceResponse.Dados = null;
                    serviceResponse.Mensagem = "Erro ao encontrar usuário";
                    serviceResponse.Sucesso = false;

                    return serviceResponse;
                }

                var aulaResposta = _mapper.Map<AulaResponseDTO>(aulaMapeada);
                serviceResponse.Dados = aulaResposta;
                serviceResponse.Mensagem = "Dados obtidos com sucesso!";
            }
            catch (Exception ex)
            {
                serviceResponse.Mensagem = ex.Message;
                serviceResponse.Sucesso = false;
            }
            return serviceResponse;
        }

        public async Task<ServiceResponse<List<AulaResponseDTO>>> GetAulas()
        {
            ServiceResponse<List<AulaResponseDTO>> serviceResponse = new ServiceResponse<List<AulaResponseDTO>>();

            try
            {
                var aulaModel = await _context.Aula.ToListAsync();

                var aulaResposta = _mapper.Map<List<AulaResponseDTO>>(aulaModel);

                serviceResponse.Dados = aulaResposta;

                if (serviceResponse.Dados == null || serviceResponse.Dados.Count == 0)
                {
                    serviceResponse.Mensagem = "Nenhum dado encontrado!";
                    return serviceResponse;
                }

                serviceResponse.Mensagem = "Dados obtidos com sucesso!";
            }
            catch (Exception ex)
            {
                serviceResponse.Mensagem = ex.Message;
                serviceResponse.Sucesso = false;
            }

            return serviceResponse;
        }

        public async Task<ServiceResponse<AulaResponseDTO>> UpdateAula(int id, AulaUpdateDTO editAula)
        {
            ServiceResponse<AulaResponseDTO> serviceResponse = new ServiceResponse<AulaResponseDTO>();

            try
            {
                var aulaMapeada = await _context.Aula
                    .FirstOrDefaultAsync(a => a.Id == id);

                if (aulaMapeada == null)
                {
                    serviceResponse.Sucesso = false;
                    serviceResponse.Mensagem = "Aula não encontrada.";
                    return serviceResponse;
                }

                _mapper.Map(editAula, aulaMapeada);

                if (!string.IsNullOrEmpty(editAula.Descricao))
                {
                    aulaMapeada.Descricao = editAula.Descricao;
                }

                _context.Aula.Update(aulaMapeada);
                await _context.SaveChangesAsync();

                serviceResponse.Dados = _mapper.Map<AulaResponseDTO>(aulaMapeada);
                serviceResponse.Mensagem = "Aula atualizada com sucesso.";
            }
            catch (Exception ex)
            {
                serviceResponse.Mensagem = ex.Message;
                serviceResponse.Sucesso = false;
            }
            return serviceResponse;
        }
    }
}
