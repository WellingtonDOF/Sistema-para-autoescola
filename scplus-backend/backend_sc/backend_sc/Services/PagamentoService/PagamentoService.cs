using AutoMapper;
using backend_sc.DataContext;
using backend_sc.DTOs.PagamentoDTO;
using backend_sc.DTOs.ParcelaDTO;
using backend_sc.Enums;
using backend_sc.Models;
using Microsoft.EntityFrameworkCore;

namespace backend_sc.Services.PagamentoService
{
    public class PagamentoService : IPagamentoInterface
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public PagamentoService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<ServiceResponse<PagamentoResponseDTO>> CreatePagamento(PagamentoCreateDTO newPagamento)
        {
            var serviceResponse = new ServiceResponse<PagamentoResponseDTO>();

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                if (newPagamento == null)
                {
                    serviceResponse.Sucesso = false;
                    serviceResponse.Mensagem = "Dados inválidos!";
                    return serviceResponse;
                }

                // Verifica se o aluno existe
                var alunoExiste = await _context.Alunos.AnyAsync(a => a.Id == newPagamento.AlunoId);
                if (!alunoExiste)
                {
                    serviceResponse.Sucesso = false;
                    serviceResponse.Mensagem = "Aluno não encontrado!";
                    return serviceResponse;
                }

                var pagamentoModel = _mapper.Map<PagamentoModel>(newPagamento);
                pagamentoModel.StatusPagamento = StatusPagamentoEnum.Pendente;
                pagamentoModel.DataPagamento = DateTime.Now;

                _context.Pagamentos.Add(pagamentoModel);
                await _context.SaveChangesAsync();

                // Se for parcelado, gera as parcelas
                if (newPagamento.FormaPagamento.ToUpper() == "PARCELADO" && newPagamento.QuantidadeParcelas.HasValue)
                {
                    await GerarParcelas(pagamentoModel.Id, newPagamento);
                }

                await transaction.CommitAsync();

                var pagamentoComDetalhes = await GetPagamentoComDetalhes(pagamentoModel.Id);
                var pagamentoResponse = _mapper.Map<PagamentoResponseDTO>(pagamentoComDetalhes);

                serviceResponse.Dados = pagamentoResponse;
                serviceResponse.Mensagem = "Pagamento criado com sucesso!";
                serviceResponse.Sucesso = true;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                serviceResponse.Sucesso = false;
                serviceResponse.Mensagem = ex.Message;
            }

            return serviceResponse;
        }

        public async Task<ServiceResponse<PagamentoResponseDTO>> GetPagamentoById(int id)
        {
            var serviceResponse = new ServiceResponse<PagamentoResponseDTO>();

            try
            {
                var pagamento = await GetPagamentoComDetalhes(id);

                if (pagamento == null)
                {
                    serviceResponse.Dados = null;
                    serviceResponse.Mensagem = "Pagamento não encontrado";
                    serviceResponse.Sucesso = false;
                    return serviceResponse;
                }

                var pagamentoResponse = _mapper.Map<PagamentoResponseDTO>(pagamento);
                serviceResponse.Dados = pagamentoResponse;
                serviceResponse.Mensagem = "Dados obtidos com sucesso!";
            }
            catch (Exception ex)
            {
                serviceResponse.Mensagem = ex.Message;
                serviceResponse.Sucesso = false;
            }

            return serviceResponse;
        }

        public async Task<ServiceResponse<List<PagamentoResponseDTO>>> GetPagamentos()
        {
            var serviceResponse = new ServiceResponse<List<PagamentoResponseDTO>>();

            try
            {
                var pagamentos = await _context.Pagamentos
                    .Include(p => p.Aluno)
                    .Include(p => p.Parcelas)
                    .OrderByDescending(p => p.DataCriacao)
                    .ToListAsync();

                var pagamentosResponse = _mapper.Map<List<PagamentoResponseDTO>>(pagamentos);

                serviceResponse.Dados = pagamentosResponse;

                if (serviceResponse.Dados == null || serviceResponse.Dados.Count == 0)
                {
                    serviceResponse.Mensagem = "Nenhum pagamento encontrado!";
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

        public async Task<ServiceResponse<PagamentoResponseDTO>> UpdatePagamento(int id, PagamentoUpdateDTO editPagamento)
        {
            var serviceResponse = new ServiceResponse<PagamentoResponseDTO>();

            try
            {
                var pagamento = await _context.Pagamentos.FindAsync(id);

                if (pagamento == null)
                {
                    serviceResponse.Sucesso = false;
                    serviceResponse.Mensagem = "Pagamento não encontrado.";
                    return serviceResponse;
                }

                _mapper.Map(editPagamento, pagamento);
                pagamento.DataAtualizacao = DateTime.Now;

                _context.Pagamentos.Update(pagamento);
                await _context.SaveChangesAsync();

                var pagamentoAtualizado = await GetPagamentoComDetalhes(id);
                serviceResponse.Dados = _mapper.Map<PagamentoResponseDTO>(pagamentoAtualizado);
                serviceResponse.Mensagem = "Pagamento atualizado com sucesso.";
            }
            catch (Exception ex)
            {
                serviceResponse.Mensagem = ex.Message;
                serviceResponse.Sucesso = false;
            }

            return serviceResponse;
        }

        public async Task<ServiceResponse<PagamentoResponseDTO>> CancelarPagamento(int id)
        {
            var serviceResponse = new ServiceResponse<PagamentoResponseDTO>();

            try
            {
                var pagamento = await _context.Pagamentos
                    .Include(p => p.Parcelas)
                    .FirstOrDefaultAsync(p => p.Id == id);

                if (pagamento == null)
                {
                    serviceResponse.Sucesso = false;
                    serviceResponse.Mensagem = "Pagamento não encontrado.";
                    return serviceResponse;
                }

                pagamento.StatusPagamento = StatusPagamentoEnum.Cancelado;
                pagamento.DataAtualizacao = DateTime.Now;

                // Cancela todas as parcelas pendentes
                foreach (var parcela in pagamento.Parcelas.Where(p => p.StatusParcela == StatusParcelaEnum.Pendente))
                {
                    parcela.StatusParcela = StatusParcelaEnum.Cancelada;
                    parcela.DataAtualizacao = DateTime.Now;
                }

                await _context.SaveChangesAsync();

                var pagamentoAtualizado = await GetPagamentoComDetalhes(id);
                serviceResponse.Dados = _mapper.Map<PagamentoResponseDTO>(pagamentoAtualizado);
                serviceResponse.Mensagem = "Pagamento cancelado com sucesso.";
            }
            catch (Exception ex)
            {
                serviceResponse.Mensagem = ex.Message;
                serviceResponse.Sucesso = false;
            }

            return serviceResponse;
        }

        public async Task<ServiceResponse<PagamentoResponseDTO>> GetPagamentoByAlunoId(int alunoId)
        {
            var serviceResponse = new ServiceResponse<PagamentoResponseDTO>();

            try
            {
                var pagamento = await _context.Pagamentos
                    .Include(p => p.Aluno)
                    .Include(p => p.Parcelas)
                    .FirstOrDefaultAsync(p => p.AlunoId == alunoId);

                if (pagamento == null)
                {
                    serviceResponse.Dados = null;
                    serviceResponse.Mensagem = "Nenhum pagamento encontrado para este aluno";
                    serviceResponse.Sucesso = false;
                    return serviceResponse;
                }

                var pagamentoResponse = _mapper.Map<PagamentoResponseDTO>(pagamento);
                serviceResponse.Dados = pagamentoResponse;
                serviceResponse.Mensagem = "Dados obtidos com sucesso!";
            }
            catch (Exception ex)
            {
                serviceResponse.Mensagem = ex.Message;
                serviceResponse.Sucesso = false;
            }

            return serviceResponse;
        }

        public async Task<ServiceResponse<List<PagamentoResponseDTO>>> GetPagamentosPorStatus(string status)
        {
            var serviceResponse = new ServiceResponse<List<PagamentoResponseDTO>>();

            try
            {
                if (!Enum.TryParse<StatusPagamentoEnum>(status, true, out var statusEnum))
                {
                    serviceResponse.Sucesso = false;
                    serviceResponse.Mensagem = "Status inválido!";
                    return serviceResponse;
                }

                var pagamentos = await _context.Pagamentos
                    .Include(p => p.Aluno)
                    .Include(p => p.Parcelas)
                    .Where(p => p.StatusPagamento == statusEnum)
                    .OrderByDescending(p => p.DataCriacao)
                    .ToListAsync();

                var pagamentosResponse = _mapper.Map<List<PagamentoResponseDTO>>(pagamentos);
                serviceResponse.Dados = pagamentosResponse;
                serviceResponse.Mensagem = $"Pagamentos com status '{status}' obtidos com sucesso!";
            }
            catch (Exception ex)
            {
                serviceResponse.Mensagem = ex.Message;
                serviceResponse.Sucesso = false;
            }

            return serviceResponse;
        }

        public async Task<ServiceResponse<List<PagamentoResponseDTO>>> GetPagamentosVencidos()
        {
            var serviceResponse = new ServiceResponse<List<PagamentoResponseDTO>>();

            try
            {
                var hoje = DateTime.Today;
                var pagamentos = await _context.Pagamentos
                    .Include(p => p.Aluno)
                    .Include(p => p.Parcelas)
                    .Where(p => p.Parcelas.Any(parcela =>
                        parcela.DataVencimento < hoje &&
                        parcela.StatusParcela == StatusParcelaEnum.Pendente))
                    .OrderByDescending(p => p.DataCriacao)
                    .ToListAsync();

                var pagamentosResponse = _mapper.Map<List<PagamentoResponseDTO>>(pagamentos);
                serviceResponse.Dados = pagamentosResponse;
                serviceResponse.Mensagem = "Pagamentos vencidos obtidos com sucesso!";
            }
            catch (Exception ex)
            {
                serviceResponse.Mensagem = ex.Message;
                serviceResponse.Sucesso = false;
            }

            return serviceResponse;
        }

        public Task<ServiceResponse<bool>> DeletePagamento(int id)
        {
            throw new NotImplementedException();
        }

        // Métodos auxiliares
        private async Task<PagamentoModel> GetPagamentoComDetalhes(int id)
        {
            return await _context.Pagamentos
                .Include(p => p.Aluno)
                .Include(p => p.Parcelas.OrderBy(parcela => parcela.NumeroParcela))
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        private async Task GerarParcelas(int pagamentoId, PagamentoCreateDTO dadosPagamento)
        {
            var valorParcela = dadosPagamento.ValorTotal / dadosPagamento.QuantidadeParcelas.Value;
            var dataPrimeiraParcela = dadosPagamento.DataPrimeiraParcela ?? DateTime.Today.AddDays(30);

            for (int i = 1; i <= dadosPagamento.QuantidadeParcelas.Value; i++)
            {
                var dataVencimento = dataPrimeiraParcela.AddDays((i - 1) * dadosPagamento.IntervaloEntreParcelas.Value);

                var parcela = new ParcelaModel
                {
                    NumeroParcela = i,
                    Valor = valorParcela,
                    StatusParcela = StatusParcelaEnum.Pendente,
                    DataVencimento = dataVencimento,
                    PagamentoId = pagamentoId,
                    Juros = 0,
                    Multa = 0
                };

                _context.Parcelas.Add(parcela);
            }

            await _context.SaveChangesAsync();
        }
    }
}
