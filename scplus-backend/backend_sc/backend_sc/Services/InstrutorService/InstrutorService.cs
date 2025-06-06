using AutoMapper;
using backend_sc.DataContext;
using backend_sc.DTOs.AlunoDTO;
using backend_sc.DTOs.InstrutorDTO;
using backend_sc.DTOs.InstrutorDTO;
using backend_sc.Enums;
using backend_sc.Models;
using backend_sc.Security;
using Microsoft.EntityFrameworkCore;

namespace backend_sc.Services.InstrutorService
{
    public class InstrutorService : IInstrutorInterface
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IPasswordHasher _passwordHasher;

        public InstrutorService(ApplicationDbContext context, IMapper mapper, IPasswordHasher passwordHasher)
        {
            _context = context;
            _mapper = mapper;
            _passwordHasher = passwordHasher;
        }

        public async Task<ServiceResponse<InstrutorResponseDTO>> CreateInstrutor(InstrutorCreateDTO newInstrutor)
        {
            var serviceResponse = new ServiceResponse<InstrutorResponseDTO>();

            try
            {
                if (newInstrutor == null)
                {
                    serviceResponse.Sucesso = false;
                    serviceResponse.Mensagem = "Dados inválidos!";
                    return serviceResponse;
                }

                var pessoaExistente = await _context.Pessoas.FirstOrDefaultAsync(p => p.Cpf == newInstrutor.Cpf);

                if (pessoaExistente != null)
                {
                    serviceResponse.Sucesso = false;
                    serviceResponse.Mensagem = $"O CPF '{newInstrutor.Cpf}' já está cadastrado!";
                    return serviceResponse;
                }

                var instrutorModel = _mapper.Map<InstrutorModel>(newInstrutor);
                instrutorModel.Senha = _passwordHasher.Hash(newInstrutor.Senha);
                instrutorModel.Status = true;

                _context.Instrutores.Add(instrutorModel);
                await _context.SaveChangesAsync();

                var InstrutorComPermissao = await _context.Instrutores
                    .Include(a => a.Permissao)
                    .FirstOrDefaultAsync(a => a.Id == instrutorModel.Id);

                var instrutorResponse = _mapper.Map<InstrutorResponseDTO>(InstrutorComPermissao);
                serviceResponse.Dados = instrutorResponse;
                serviceResponse.Mensagem = "Instrutor criado com sucesso!";
                serviceResponse.Sucesso = true;
            }
            catch (Exception ex)
            {
                serviceResponse.Sucesso = false;
                serviceResponse.Mensagem = ex.Message;
            }

            return serviceResponse;
        }

        public Task<ServiceResponse<bool>> DeleteInstrutor(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<ServiceResponse<InstrutorResponseDTO>> GetInstrutorByCpf(string cpf)
        {
            ServiceResponse<InstrutorResponseDTO> serviceResponse = new ServiceResponse<InstrutorResponseDTO>();

            try
            {
                var instrutorMapeado = await _context.Instrutores
                    .Include(a => a.Permissao)
                    .FirstOrDefaultAsync(p => p.Cpf == cpf);

                if (instrutorMapeado == null)
                {
                    serviceResponse.Dados = null;
                    serviceResponse.Mensagem = "Erro ao encontrar usuário";
                    serviceResponse.Sucesso = false;

                    return serviceResponse;
                }

                var instrutorResposta = _mapper.Map<InstrutorResponseDTO>(instrutorMapeado);
                serviceResponse.Dados = instrutorResposta;
                serviceResponse.Mensagem = "Dados obtidos com sucesso!";
            }
            catch (Exception ex)
            {
                serviceResponse.Mensagem = ex.Message;
                serviceResponse.Sucesso = false;
            }
            return serviceResponse;
        }

        public async Task<ServiceResponse<InstrutorResponseDTO>> GetInstrutorById(int id)
        {
            ServiceResponse<InstrutorResponseDTO> serviceResponse = new ServiceResponse<InstrutorResponseDTO>();

            try
            {
                var instrutorMapeado = await _context.Instrutores
                    .Include(a => a.Permissao)
                    .FirstOrDefaultAsync(p => p.Id == id);

                if (instrutorMapeado == null)
                {
                    serviceResponse.Dados = null;
                    serviceResponse.Mensagem = "Erro ao encontrar usuário";
                    serviceResponse.Sucesso = false;

                    return serviceResponse;
                }

                var instrutorResposta = _mapper.Map<InstrutorResponseDTO>(instrutorMapeado);
                serviceResponse.Dados = instrutorResposta;
                serviceResponse.Mensagem = "Dados obtidos com sucesso!";
            }
            catch (Exception ex)
            {
                serviceResponse.Mensagem = ex.Message;
                serviceResponse.Sucesso = false;
            }
            return serviceResponse;        
        }

        public async Task<ServiceResponse<List<InstrutorResponseDTO>>> GetInstrutores()
        {
            ServiceResponse<List<InstrutorResponseDTO>> serviceResponse = new ServiceResponse<List<InstrutorResponseDTO>>();

            try
            {
                var instrutorModel = await _context.Instrutores.Include(p => p.Permissao).ToListAsync();

                var instrutorResposta = _mapper.Map<List<InstrutorResponseDTO>>(instrutorModel);

                serviceResponse.Dados = instrutorResposta;

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

        public async Task<ServiceResponse<InstrutorResponseDTO>> MudarStatusInstrutor(int id)
        {
            ServiceResponse<InstrutorResponseDTO> serviceResponse = new ServiceResponse<InstrutorResponseDTO>();

            try
            {
                var instrutorMapeado = await _context.Instrutores
                    .Include(a => a.Permissao)
                    .FirstOrDefaultAsync(a => a.Id == id);

                if (instrutorMapeado == null)
                {
                    serviceResponse.Dados = null;
                    serviceResponse.Mensagem = "Erro ao encontrar usuário";
                    serviceResponse.Sucesso = false;
                    
                    return serviceResponse;
                }

                if (instrutorMapeado.Status == true)
                    instrutorMapeado.Status = false;
                else
                    instrutorMapeado.Status = true;

                await _context.SaveChangesAsync();

                serviceResponse.Dados = _mapper.Map<InstrutorResponseDTO>(instrutorMapeado); 
                serviceResponse.Mensagem = $"Mudança para '{(instrutorMapeado.Status == true ? "Ativo" : "Inativo")}' concluída!";
            }
            catch (Exception ex)
            {
                serviceResponse.Mensagem = ex.Message;
                serviceResponse.Sucesso = false;
            }
            return serviceResponse;
        }

        public async Task<ServiceResponse<InstrutorResponseDTO>> UpdateInstrutor(int id, InstrutorUpdateDTO editInstrutor)
        {
            ServiceResponse<InstrutorResponseDTO> serviceResponse = new ServiceResponse<InstrutorResponseDTO>();

            try
            {
                var instrutorMapeado = await _context.Instrutores
                    .Include(a => a.Permissao)
                    .FirstOrDefaultAsync(a => a.Id == id);

                if (instrutorMapeado == null)
                {
                    serviceResponse.Sucesso = false;
                    serviceResponse.Mensagem = "Usuário não encontrado.";
                    return serviceResponse;
                }

                _mapper.Map(editInstrutor, instrutorMapeado);

                if (!string.IsNullOrEmpty(editInstrutor.Senha))
                {
                    instrutorMapeado.Senha = _passwordHasher.Hash(editInstrutor.Senha);
                }

                _context.Instrutores.Update(instrutorMapeado);
                await _context.SaveChangesAsync();

                serviceResponse.Dados = _mapper.Map<InstrutorResponseDTO>(instrutorMapeado);
                serviceResponse.Mensagem = "Usuário atualizado com sucesso.";
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
