using AutoMapper;
using backend_sc.DataContext;
using backend_sc.DTOs.ParcelaDTO;
using backend_sc.Enums;
using backend_sc.Models;
using Microsoft.EntityFrameworkCore;

namespace backend_sc.Services.ParcelaService
{
    public class ParcelaService : IParcelaInterface
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public ParcelaService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<ServiceResponse<ParcelaResponseDTO>> CreateParcela(ParcelaCreateDTO newParcela)
        {
            var serviceResponse = new ServiceResponse<ParcelaResponseDTO>();

            try
            {
                if (newParcela == null)
                {
                    serviceResponse.Sucesso = false;
                    serviceResponse.Mensagem = "Dados inválidos!";
                    return serviceResponse;
                }

                // Verifica se o pagamento existe
                var pagamentoExiste = await _context.Pagamentos.AnyAsync(p => p.Id == newParcela.PagamentoId);
                if (!pagamentoExiste)
                {
                    serviceResponse.Sucesso = false;
                    serviceResponse.Mensagem = "Pagamento não encontrado!";
                    return serviceResponse;
                }

                var parcelaModel = _mapper.Map<ParcelaModel>(newParcela);
                parcelaModel.StatusParcela = StatusParcelaEnum.Pendente;

                _context.Parcelas.Add(parcelaModel);
                await _context.SaveChangesAsync();

                var parcelaResponse = _mapper.Map<ParcelaResponseDTO>(parcelaModel);
                serviceResponse.Dados = parcelaResponse;
                serviceResponse.Mensagem = "Parcela criada com sucesso!";
                serviceResponse.Sucesso = true;
            }
            catch (Exception ex)
            {
                serviceResponse.Sucesso = false;
                serviceResponse.Mensagem = ex.Message;
            }

            return serviceResponse;
        }

        public async Task<ServiceResponse<ParcelaResponseDTO>> GetParcelaById(int id)
        {
            var serviceResponse = new ServiceResponse<ParcelaResponseDTO>();

            try
            {
                var parcela = await _context.Parcelas
                    .Include(p => p.Pagamento)
                    .ThenInclude(pg => pg.Aluno)
                    .FirstOrDefaultAsync(p => p.Id == id);

                if (parcela == null)
                {
                    serviceResponse.Dados = null;
                    serviceResponse.Mensagem = "Parcela não encontrada";
                    serviceResponse.Sucesso = false;
                    return serviceResponse;
                }

                var parcelaResponse = _mapper.Map<ParcelaResponseDTO>(parcela);
                serviceResponse.Dados = parcelaResponse;
                serviceResponse.Mensagem = "Dados obtidos com sucesso!";
            }
            catch (Exception ex)
            {
                serviceResponse.Mensagem = ex.Message;
                serviceResponse.Sucesso = false;
            }

            return serviceResponse;
        }

        public async Task<ServiceResponse<List<ParcelaResponseDTO>>> GetParcelas()
        {
            var serviceResponse = new ServiceResponse<List<ParcelaResponseDTO>>();

            try
            {
                var parcelas = await _context.Parcelas
                    .Include(p => p.Pagamento)
                    .ThenInclude(pg => pg.Aluno)
                    .OrderBy(p => p.DataVencimento)
                    .ToListAsync();

                var parcelasResponse = _mapper.Map<List<ParcelaResponseDTO>>(parcelas);

                serviceResponse.Dados = parcelasResponse;

                if (serviceResponse.Dados == null || serviceResponse.Dados.Count == 0)
                {
                    serviceResponse.Mensagem = "Nenhuma parcela encontrada!";
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

        public async Task<ServiceResponse<List<ParcelaResponseDTO>>> GetParcelasByPagamentoId(int pagamentoId)
        {
            var serviceResponse = new ServiceResponse<List<ParcelaResponseDTO>>();

            try
            {
                var parcelas = await _context.Parcelas
                    .Include(p => p.Pagamento)
                    .ThenInclude(pg => pg.Aluno)
                    .Where(p => p.PagamentoId == pagamentoId)
                    .OrderBy(p => p.NumeroParcela)
                    .ToListAsync();

                var parcelasResponse = _mapper.Map<List<ParcelaResponseDTO>>(parcelas);
                serviceResponse.Dados = parcelasResponse;
                serviceResponse.Mensagem = "Parcelas obtidas com sucesso!";
            }
            catch (Exception ex)
            {
                serviceResponse.Mensagem = ex.Message;
                serviceResponse.Sucesso = false;
            }

            return serviceResponse;
        }

        public async Task<ServiceResponse<ParcelaResponseDTO>> UpdateParcela(int id, ParcelaUpdateDTO editParcela)
        {
            var serviceResponse = new ServiceResponse<ParcelaResponseDTO>();

            try
            {
                var parcela = await _context.Parcelas.FindAsync(id);

                if (parcela == null)
                {
                    serviceResponse.Sucesso = false;
                    serviceResponse.Mensagem = "Parcela não encontrada.";
                    return serviceResponse;
                }

                _mapper.Map(editParcela, parcela);
                parcela.DataAtualizacao = DateTime.Now;

                _context.Parcelas.Update(parcela);
                await _context.SaveChangesAsync();

                var parcelaAtualizada = await _context.Parcelas
                    .Include(p => p.Pagamento)
                    .ThenInclude(pg => pg.Aluno)
                    .FirstOrDefaultAsync(p => p.Id == id);

                serviceResponse.Dados = _mapper.Map<ParcelaResponseDTO>(parcelaAtualizada);
                serviceResponse.Mensagem = "Parcela atualizada com sucesso.";
            }
            catch (Exception ex)
            {
                serviceResponse.Mensagem = ex.Message;
                serviceResponse.Sucesso = false;
            }

            return serviceResponse;
        }

        public async Task<ServiceResponse<ParcelaResponseDTO>> MarcarComoPaga(int id, decimal? valorPago = null)
        {
            var serviceResponse = new ServiceResponse<ParcelaResponseDTO>();

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var parcela = await _context.Parcelas
                    .Include(p => p.Pagamento)
                    .ThenInclude(pg => pg.Parcelas)
                    .FirstOrDefaultAsync(p => p.Id == id);

                if (parcela == null)
                {
                    serviceResponse.Sucesso = false;
                    serviceResponse.Mensagem = "Parcela não encontrada.";
                    return serviceResponse;
                }

                if (parcela.StatusParcela == StatusParcelaEnum.Paga)
                {
                    serviceResponse.Sucesso = false;
                    serviceResponse.Mensagem = "Parcela já está paga.";
                    return serviceResponse;
                }

                parcela.StatusParcela = StatusParcelaEnum.Paga;
                parcela.DataPagamento = DateTime.Now;
                parcela.ValorPago = valorPago ?? parcela.Valor + (parcela.Juros ?? 0) + (parcela.Multa ?? 0);
                parcela.DataAtualizacao = DateTime.Now;

                // Atualiza o status do pagamento principal
                await AtualizarStatusPagamento(parcela.Pagamento);

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                var parcelaAtualizada = await _context.Parcelas
                    .Include(p => p.Pagamento)
                    .ThenInclude(pg => pg.Aluno)
                    .FirstOrDefaultAsync(p => p.Id == id);

                serviceResponse.Dados = _mapper.Map<ParcelaResponseDTO>(parcelaAtualizada);
                serviceResponse.Mensagem = "Parcela marcada como paga com sucesso.";
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                serviceResponse.Mensagem = ex.Message;
                serviceResponse.Sucesso = false;
            }

            return serviceResponse;
        }

        public async Task<ServiceResponse<List<ParcelaResponseDTO>>> GetParcelasVencidas()
        {
            var serviceResponse = new ServiceResponse<List<ParcelaResponseDTO>>();

            try
            {
                var hoje = DateTime.Today;
                var parcelas = await _context.Parcelas
                    .Include(p => p.Pagamento)
                    .ThenInclude(pg => pg.Aluno)
                    .Where(p => p.DataVencimento < hoje && p.StatusParcela == StatusParcelaEnum.Pendente)
                    .OrderBy(p => p.DataVencimento)
                    .ToListAsync();

                var parcelasResponse = _mapper.Map<List<ParcelaResponseDTO>>(parcelas);
                serviceResponse.Dados = parcelasResponse;
                serviceResponse.Mensagem = "Parcelas vencidas obtidas com sucesso!";
            }
            catch (Exception ex)
            {
                serviceResponse.Mensagem = ex.Message;
                serviceResponse.Sucesso = false;
            }

            return serviceResponse;
        }

        public async Task<ServiceResponse<List<ParcelaResponseDTO>>> GetParcelasVencendoEm(int dias)
        {
            var serviceResponse = new ServiceResponse<List<ParcelaResponseDTO>>();

            try
            {
                var dataLimite = DateTime.Today.AddDays(dias);
                var parcelas = await _context.Parcelas
                    .Include(p => p.Pagamento)
                    .ThenInclude(pg => pg.Aluno)
                    .Where(p => p.DataVencimento <= dataLimite &&
                               p.DataVencimento >= DateTime.Today &&
                               p.StatusParcela == StatusParcelaEnum.Pendente)
                    .OrderBy(p => p.DataVencimento)
                    .ToListAsync();

                var parcelasResponse = _mapper.Map<List<ParcelaResponseDTO>>(parcelas);
                serviceResponse.Dados = parcelasResponse;
                serviceResponse.Mensagem = $"Parcelas vencendo em {dias} dias obtidas com sucesso!";
            }
            catch (Exception ex)
            {
                serviceResponse.Mensagem = ex.Message;
                serviceResponse.Sucesso = false;
            }

            return serviceResponse;
        }

        public Task<ServiceResponse<bool>> DeleteParcela(int id)
        {
            throw new NotImplementedException();
        }

        // auxiliar para atualizar status do pagamento
        private async Task AtualizarStatusPagamento(PagamentoModel pagamento)
        {
            var todasParcelas = pagamento.Parcelas;
            var parcelasPagas = todasParcelas.Count(p => p.StatusParcela == StatusParcelaEnum.Paga);
            var totalParcelas = todasParcelas.Count;

            if (parcelasPagas == 0)
            {
                pagamento.StatusPagamento = StatusPagamentoEnum.Pendente;
            }
            else if (parcelasPagas == totalParcelas)
            {
                pagamento.StatusPagamento = StatusPagamentoEnum.Pago;
            }
            else
            {
                pagamento.StatusPagamento = StatusPagamentoEnum.Parcial;
            }

            pagamento.DataAtualizacao = DateTime.Now;
        }
    }
}
