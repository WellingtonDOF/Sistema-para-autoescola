using AutoMapper;
using backend_sc.DataContext;
using backend_sc.DTOs.AlunoDTO;
using backend_sc.DTOs.PessoaDTO;
using backend_sc.Enums;
using backend_sc.Models;
using backend_sc.Services.PessoaService;
using Microsoft.EntityFrameworkCore;
using backend_sc.Security;
using Microsoft.AspNetCore.Mvc;
using backend_sc.Mapping;

namespace backend_sc.Services.AlunoService
{
    public class AlunoService : IAlunoInterface
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IPasswordHasher _passwordHasher;

        public AlunoService(ApplicationDbContext context, IMapper mapper, IPasswordHasher passwordHasher)
        {
            _context = context;
            _mapper = mapper;
            _passwordHasher = passwordHasher;
        }

        public async Task<ServiceResponse<AlunoResponseDTO>> CreateAluno(AlunoCreateDTO newAluno)
        {
            var serviceResponse = new ServiceResponse<AlunoResponseDTO>();

            try
            {
                if (newAluno == null)
                {
                    serviceResponse.Sucesso = false;
                    serviceResponse.Mensagem = "Dados inválidos!";
                    return serviceResponse;
                }

                var pessoaExistente = await _context.Pessoas.FirstOrDefaultAsync(p => p.Cpf == newAluno.Cpf);

                if (pessoaExistente != null)
                {
                    serviceResponse.Sucesso = false;
                    serviceResponse.Mensagem = $"O CPF '{newAluno.Cpf}' já está cadastrado!";
                    return serviceResponse;
                }

                var alunoModel = _mapper.Map<AlunoModel>(newAluno);
                alunoModel.Senha = _passwordHasher.Hash(newAluno.Senha); 
                alunoModel.Status= true;

                alunoModel.StatusPagamento = StatusPagamentoEnum.Pendente;
                alunoModel.StatusCurso = true;

                _context.Alunos.Add(alunoModel);
                await _context.SaveChangesAsync();

                var alunoComPermissao = await _context.Alunos
                    .Include(a => a.Permissao) 
                    .FirstOrDefaultAsync(a => a.Id == alunoModel.Id);

                var alunoResponse = _mapper.Map<AlunoResponseDTO>(alunoComPermissao);
                serviceResponse.Dados = alunoResponse;
                serviceResponse.Mensagem = "Usuário criado com sucesso!";
                serviceResponse.Sucesso = true;
            }
            catch (Exception ex)
            {
                serviceResponse.Sucesso = false;
                serviceResponse.Mensagem = ex.Message;
            }

            return serviceResponse;
        }

        public Task<ServiceResponse<bool>> DeleteAluno(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<ServiceResponse<AlunoResponseDTO>> GetAlunoByCpf(string cpf)
        {
            ServiceResponse<AlunoResponseDTO> serviceResponse = new ServiceResponse<AlunoResponseDTO>();

            try
            {
                var alunoMapeado = await _context.Alunos
                    .Include(a => a.Permissao)
                    .FirstOrDefaultAsync(p => p.Cpf == cpf);

                if (alunoMapeado == null)
                {
                    serviceResponse.Dados = null;
                    serviceResponse.Mensagem = "Erro ao encontrar usuário";
                    serviceResponse.Sucesso = false;

                    return serviceResponse;
                }

                var alunoResposta = _mapper.Map<AlunoResponseDTO>(alunoMapeado);
                serviceResponse.Dados = alunoResposta;
                serviceResponse.Mensagem = "Dados obtidos com sucesso!";
            }
            catch (Exception ex)
            {
                serviceResponse.Mensagem = ex.Message;
                serviceResponse.Sucesso = false;
            }
            return serviceResponse;
        }

        public async Task<ServiceResponse<AlunoResponseDTO>> GetAlunoById(int id)
        {
            ServiceResponse<AlunoResponseDTO> serviceResponse = new ServiceResponse<AlunoResponseDTO>();

            try
            {
                var alunoMapeado = await _context.Alunos
                    .Include(a => a.Permissao)
                    .FirstOrDefaultAsync(p => p.Id == id);

                if (alunoMapeado == null)
                {
                    serviceResponse.Dados = null;
                    serviceResponse.Mensagem = "Erro ao encontrar usuário";
                    serviceResponse.Sucesso = false;

                    return serviceResponse;
                }

                var alunoResposta = _mapper.Map<AlunoResponseDTO>(alunoMapeado);
                serviceResponse.Dados = alunoResposta;
                serviceResponse.Mensagem = "Dados obtidos com sucesso!";
            }
            catch (Exception ex)
            {
                serviceResponse.Mensagem = ex.Message;
                serviceResponse.Sucesso = false;
            }
            return serviceResponse;
        }

        public async Task<ServiceResponse<List<AlunoResponseDTO>>> GetAlunos()
        {
            ServiceResponse<List<AlunoResponseDTO>> serviceResponse = new ServiceResponse<List<AlunoResponseDTO>>();

            try
            {
                var alunoModel = await _context.Alunos.Include(p=> p.Permissao).ToListAsync();

                var alunosResposta = _mapper.Map<List<AlunoResponseDTO>>(alunoModel);

                serviceResponse.Dados = alunosResposta;

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

        public async Task<ServiceResponse<AlunoResponseDTO>> MudarStatusAluno(int id)
        {
            ServiceResponse<AlunoResponseDTO> serviceResponse = new ServiceResponse<AlunoResponseDTO>();

            try
            {
                var alunoMapeado = await _context.Alunos
                    .Include(a => a.Permissao)
                    .FirstOrDefaultAsync(a => a.Id == id);
                    
                if (alunoMapeado == null)
                {
                    serviceResponse.Dados = null;
                    serviceResponse.Mensagem = "Erro ao encontrar usuário";
                    serviceResponse.Sucesso = false;

                    return serviceResponse;
                }

                if (alunoMapeado.Status == true)
                    alunoMapeado.Status = false;
                else
                    alunoMapeado.Status = true;

                await _context.SaveChangesAsync();

                serviceResponse.Dados = _mapper.Map<AlunoResponseDTO>(alunoMapeado); ;
                serviceResponse.Mensagem = $"Mudança para '{(alunoMapeado.Status == true ? "Ativo" : "Inativo")}' concluída!";
            }
            catch (Exception ex)
            {
                serviceResponse.Mensagem = ex.Message;
                serviceResponse.Sucesso = false;
            }
            return serviceResponse;
        }

        public async Task<ServiceResponse<AlunoResponseDTO>> UpdateAluno(int id, AlunoUpdateDTO editAluno)
        {
            ServiceResponse<AlunoResponseDTO> serviceResponse = new ServiceResponse<AlunoResponseDTO>();

            try
            {
                var alunoMapeado = await _context.Alunos
                    .Include(a => a.Permissao)
                    .FirstOrDefaultAsync(a => a.Id == id);

                if (alunoMapeado == null)
                {
                    serviceResponse.Sucesso = false;
                    serviceResponse.Mensagem = "Usuário não encontrado.";
                    return serviceResponse;
                }

                _mapper.Map(editAluno, alunoMapeado);

                //Se a senha foi alterada
                if (!string.IsNullOrEmpty(editAluno.Senha))
                {
                    alunoMapeado.Senha = _passwordHasher.Hash(editAluno.Senha);
                }

                _context.Alunos.Update(alunoMapeado);
                await _context.SaveChangesAsync();

                serviceResponse.Dados = _mapper.Map<AlunoResponseDTO>(alunoMapeado);
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
