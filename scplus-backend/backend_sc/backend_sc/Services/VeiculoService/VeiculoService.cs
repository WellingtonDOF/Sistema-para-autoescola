using AutoMapper;
using backend_sc.DataContext;
using backend_sc.DTOs.MatriculaDTO;
using backend_sc.DTOs.VeiculoDTO;
using backend_sc.Models;
using Microsoft.EntityFrameworkCore;

namespace backend_sc.Services.VeiculoService
{
    public class VeiculoService : IVeiculoInterface
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public VeiculoService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<ServiceResponse<VeiculoResponseDTO>> CreateVeiculo(VeiculoCreateDTO newVeiculo)
        {
            var serviceResponse = new ServiceResponse<VeiculoResponseDTO>();

            try
            {
                if (newVeiculo == null)
                {
                    serviceResponse.Sucesso = false;
                    serviceResponse.Mensagem = "Dados inválidos!";
                    return serviceResponse;
                }

                var veiculoExistente = await _context.Veiculo.FirstOrDefaultAsync(p => p.Placa == newVeiculo.Placa);

                if (veiculoExistente != null)
                {
                    serviceResponse.Sucesso = false;
                    serviceResponse.Mensagem = $"A placa '{newVeiculo.Placa}' já está cadastrada!";
                    return serviceResponse;
                }

                var veiculoModel = _mapper.Map<VeiculoModel>(newVeiculo);
                veiculoModel.StatusVeiculo = true;

                _context.Veiculo.Add(veiculoModel);
                await _context.SaveChangesAsync();

                var veiculoResponse = _mapper.Map<VeiculoResponseDTO>(veiculoModel);
                serviceResponse.Dados = veiculoResponse;
                serviceResponse.Mensagem = "Veiculo criado com sucesso!";
                serviceResponse.Sucesso = true;
            }
            catch (Exception ex)
            {
                serviceResponse.Sucesso = false;
                serviceResponse.Mensagem = ex.Message;
            }

            return serviceResponse;
        }

        public Task<ServiceResponse<bool>> DeleteVeiculo(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<ServiceResponse<VeiculoResponseDTO>> GetVeiculoById(int id)
        {
            ServiceResponse<VeiculoResponseDTO> serviceResponse = new ServiceResponse<VeiculoResponseDTO>();

            try
            {
                var veiculoMapeado = await _context.Veiculo.FirstOrDefaultAsync(p => p.Id == id);

                if (veiculoMapeado == null)
                {
                    serviceResponse.Dados = null;
                    serviceResponse.Mensagem = "Erro ao encontrar usuário";
                    serviceResponse.Sucesso = false;

                    return serviceResponse;
                }

                var veiculoResposta = _mapper.Map<VeiculoResponseDTO>(veiculoMapeado);
                serviceResponse.Dados = veiculoResposta;
                serviceResponse.Mensagem = "Dados obtidos com sucesso!";
            }
            catch (Exception ex)
            {
                serviceResponse.Mensagem = ex.Message;
                serviceResponse.Sucesso = false;
            }
            return serviceResponse;
        }

        public async Task<ServiceResponse<List<VeiculoResponseDTO>>> GetVeiculos()
        {
            ServiceResponse<List<VeiculoResponseDTO>> serviceResponse = new ServiceResponse<List<VeiculoResponseDTO>>();

            try
            {
                var veiculoModel = await _context.Veiculo.ToListAsync();

                var veiculoResposta = _mapper.Map<List<VeiculoResponseDTO>>(veiculoModel);

                serviceResponse.Dados = veiculoResposta;

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

        public async Task<ServiceResponse<VeiculoResponseDTO>> InativarVeiculo(int id)
        {
            ServiceResponse<VeiculoResponseDTO> serviceResponse = new ServiceResponse<VeiculoResponseDTO>();

            try
            {
                var veiculoMapeado = await _context.Veiculo.FirstOrDefaultAsync(a => a.Id == id);

                if (veiculoMapeado == null)
                {
                    serviceResponse.Dados = null;
                    serviceResponse.Mensagem = "Erro ao encontrar o veículo";
                    serviceResponse.Sucesso = false;

                    return serviceResponse;
                }

                if (veiculoMapeado.StatusVeiculo == true)
                    veiculoMapeado.StatusVeiculo = false;
                else
                    veiculoMapeado.StatusVeiculo = true;

                await _context.SaveChangesAsync();

                serviceResponse.Dados = _mapper.Map<VeiculoResponseDTO>(veiculoMapeado); ;
                serviceResponse.Mensagem = $"Mudança para '{(veiculoMapeado.StatusVeiculo == true ? "Ativo" : "Inativo")}' concluída!";
            }
            catch (Exception ex)
            {
                serviceResponse.Mensagem = ex.Message;
                serviceResponse.Sucesso = false;
            }
            return serviceResponse;
        }

        public async Task<ServiceResponse<VeiculoResponseDTO>> UpdateVeiculo(int id, VeiculoUpdateDTO editVeiculo)
        {
            ServiceResponse<VeiculoResponseDTO> serviceResponse = new ServiceResponse<VeiculoResponseDTO>();

            try
            {
                var veiculoMapeado = await _context.Veiculo.FirstOrDefaultAsync(a => a.Id == id);

                if (veiculoMapeado == null)
                {
                    serviceResponse.Sucesso = false;
                    serviceResponse.Mensagem = "Veículo não encontrado.";
                    return serviceResponse;
                }

                _mapper.Map(editVeiculo, veiculoMapeado);

                _context.Veiculo.Update(veiculoMapeado);
                await _context.SaveChangesAsync();

                serviceResponse.Dados = _mapper.Map<VeiculoResponseDTO>(veiculoMapeado);
                serviceResponse.Mensagem = "Veículo atualizado com sucesso.";
            }
            catch (Exception ex)
            {
                serviceResponse.Mensagem = ex.Message;
                serviceResponse.Sucesso = false;
            }
            return serviceResponse;
        }


        public async Task<ServiceResponse<bool>> VerificarPlacaExistente(string placa)
        {
            ServiceResponse<bool> serviceResponse = new ServiceResponse<bool>();

            try
            {
                if (string.IsNullOrWhiteSpace(placa))
                {
                    serviceResponse.Sucesso = false;
                    serviceResponse.Mensagem = "Placa inválida";
                    return serviceResponse;
                }

                var existe = await _context.Veiculo.AnyAsync(a => a.Placa == placa);
                serviceResponse.Dados = existe;
                serviceResponse.Mensagem = existe ? "Placa já cadastrada." : "Placa disponível.";
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
