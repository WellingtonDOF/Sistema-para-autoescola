using AutoMapper;
using backend_sc.DataContext;
using backend_sc.DTOs.PessoaDTO;
using backend_sc.Enums;
using backend_sc.Models;
using backend_sc.Security;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

namespace backend_sc.Services.PessoaService
{
    public class PessoaService : IPessoaInterface
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IPasswordHasher _passwordHasher;
        
        public PessoaService(ApplicationDbContext context, IMapper mapper, IPasswordHasher passwordHasher) 
        { 
            _context = context;
            _mapper = mapper;
            _passwordHasher = passwordHasher;
        }

        public async Task<ServiceResponse<PessoaResponseDTO>> CreatePessoa(PessoaCreateDTO newPessoa)
        {
            var serviceResponse = new ServiceResponse<PessoaResponseDTO>();
            try
            {
                if (newPessoa == null)
                {
                    serviceResponse.Sucesso = false;
                    serviceResponse.Mensagem = "Dados inválidos!";
                    return serviceResponse;
                }

                var pessoaMapeada = _mapper.Map<PessoaModel>(newPessoa);
                pessoaMapeada.Senha = _passwordHasher.Hash(newPessoa.Senha);
                pessoaMapeada.Status = true;

                _context.Pessoas.Add(pessoaMapeada);

                // Só salva imediatamente se NÃO houver uma transação externa
                await _context.SaveChangesAsync();

                var pessoaResposta = _mapper.Map<PessoaResponseDTO>(pessoaMapeada);
                serviceResponse.Dados = pessoaResposta;
                serviceResponse.Mensagem = "Pessoa criada com sucesso!";
                serviceResponse.Sucesso = true;
            }
            catch (Exception ex)
            {
                serviceResponse.Sucesso = false;
                serviceResponse.Mensagem = ex.Message;
            }

            return serviceResponse;
        }

        public Task<ServiceResponse<bool>> DeletePessoa(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<ServiceResponse<PessoaResponseDTO>> GetPessoaById(int id)
        {
            ServiceResponse<PessoaResponseDTO> serviceResponse = new ServiceResponse<PessoaResponseDTO>();

            try
            {
                var pessoaMapeada = await _context.Pessoas
                        .Include(p => p.Permissao)
                        .FirstOrDefaultAsync(p => p.Id == id);

                if(pessoaMapeada == null)
                {
                    serviceResponse.Dados = null;
                    serviceResponse.Mensagem = "Erro ao encontrar usuário";
                    serviceResponse.Sucesso=false;

                    return serviceResponse;
                }

                var pessoaResposta = _mapper.Map<PessoaResponseDTO>(pessoaMapeada);
                serviceResponse.Dados = pessoaResposta;
                serviceResponse.Mensagem = "Dados obtidos com sucesso!";
            }
            catch (Exception ex)
            {
                serviceResponse.Mensagem = ex.Message;
                serviceResponse.Sucesso = false;
            }
            return serviceResponse;
        }

        public async Task<ServiceResponse<bool>> VerificarCpfExistente(string cpf)
        {
            ServiceResponse<bool> serviceResponse = new ServiceResponse<bool>();

            try
            {
                if (string.IsNullOrWhiteSpace(cpf) || cpf.Length != 11 || !cpf.All(char.IsDigit))
                {
                    serviceResponse.Sucesso = false;
                    serviceResponse.Mensagem = "CPF inválido";
                    return serviceResponse;
                }

                var existe = await _context.Pessoas.AnyAsync(a => a.Cpf == cpf);
                serviceResponse.Dados = existe;
                serviceResponse.Mensagem = existe ? "CPF já cadastrado." : "CPF disponível.";
            }
            catch (Exception ex)
            {
                serviceResponse.Mensagem = ex.Message;
                serviceResponse.Sucesso = false;
            }

            return serviceResponse;
        }
        public async Task<ServiceResponse<List<PessoaResponseDTO>>> GetPessoas()
        {
            ServiceResponse<List<PessoaResponseDTO>> serviceResponse = new ServiceResponse<List<PessoaResponseDTO>>();

            try
            {

                var pessoasModel = await _context.Pessoas.Include(p => p.Permissao).ToListAsync(); 

                var pessoasResposta = _mapper.Map<List<PessoaResponseDTO>>(pessoasModel);

                serviceResponse.Dados = pessoasResposta;

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

        public async Task<ServiceResponse<PessoaResponseDTO>> InativarPessoa(int id)
        {
            ServiceResponse<PessoaResponseDTO> serviceResponse = new ServiceResponse<PessoaResponseDTO>();

            try
            {
                var pessoaMapeada = await _context.Pessoas.FindAsync(id);

                if (pessoaMapeada == null)
                {
                    serviceResponse.Dados = null;
                    serviceResponse.Mensagem = "Erro ao encontrar usuário";
                    serviceResponse.Sucesso = false;

                    return serviceResponse;
                }

                pessoaMapeada.Status = false;
                await _context.SaveChangesAsync();
                serviceResponse.Mensagem = "Inativação concluida!";
            }
            catch (Exception ex)
            {
                serviceResponse.Mensagem = ex.Message;
                serviceResponse.Sucesso = false;
            }
            return serviceResponse;
        }

        public Task<ServiceResponse<PessoaResponseDTO>> UpdatePessoa(PessoaModel editPessoa)
        {
            throw new NotImplementedException();
        }
    }
}
