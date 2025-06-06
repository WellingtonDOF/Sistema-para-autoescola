namespace backend_sc.Profile
{
    using AutoMapper;
    using backend_sc.Configurations;
    using backend_sc.DTOs.AlunoDTO;
    using backend_sc.DTOs.AulaDTO;
    using backend_sc.DTOs.InstrutorDTO;
    using backend_sc.DTOs.LoginDTO;
    using backend_sc.DTOs.MatriculaDTO;
    using backend_sc.DTOs.PagamentoDTO;
    using backend_sc.DTOs.ParcelaDTO;
    using backend_sc.DTOs.PessoaDTO;
    using backend_sc.DTOs.VeiculoDTO;
    using backend_sc.Enums;
    using backend_sc.Mapping;
    using backend_sc.Models;
    using System.Reflection;

    public class ProfileAutoMapper : Profile
    {
        public ProfileAutoMapper()
        {
            //Mapper Pessoa
            CreateMap<PessoaModel, PessoaCreateDTO>()
                .ReverseMap()
                .ForMember(dest => dest.PermissaoId, opt => opt.ConvertUsing<TipoParaPermissaoIdConverter, string>(src => src.TipoUsuario));

            CreateMap<PessoaModel, PessoaResponseDTO>()
                .ForMember(dest => dest.TipoUsuario, opt => opt.MapFrom(src => src.PermissaoId))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status ? "Ativo" : "Inativo"));


            // ALUNO MAPEAMENTO
            CreateMap<AlunoCreateDTO, AlunoModel>()
                .ForMember(dest => dest.Senha, opt => opt.Ignore()) // Ignora a senha plain text
                .ForMember(dest => dest.PermissaoId, opt => opt.ConvertUsing<TipoParaPermissaoIdConverter, string>(src => src.TipoUsuario));
                // Mapeia outras propriedades específicas do aluno
           
            CreateMap<AlunoUpdateDTO, AlunoModel>()
                .ForMember(dest => dest.Senha, opt => opt.Ignore()) // Ignora a propriedade Senha na atualização
                .ReverseMap();

            CreateMap<AlunoModel, AlunoResponseDTO>()
                .ForMember(dest => dest.TipoUsuario, opt => opt.MapFrom(src => src.PermissaoId))
                .ForMember(dest => dest.StatusCurso, opt => opt.MapFrom(src => src.StatusCurso ? "Ativo" : "Inativo"))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status? "Ativo" : "Inativo"));

            // INSTRUTOR MAPEAMENTO
            CreateMap<InstrutorCreateDTO, InstrutorModel>()
                .ForMember(dest => dest.Senha, opt => opt.Ignore()) // Ignora a senha plain text
                .ForMember(dest => dest.PermissaoId, opt => opt.ConvertUsing<TipoParaPermissaoIdConverter, string>(src => src.TipoUsuario))
                // Mapeia outras propriedades específicas do instrutor
                .ForMember(dest => dest.CategoriaCnh, opt => opt.MapFrom(src => src.CategoriaCnh));

            CreateMap<InstrutorUpdateDTO, InstrutorModel>()
                .ForMember(dest => dest.Senha, opt => opt.Ignore()) // Ignora a propriedade Senha na atualização
                .ReverseMap();

            CreateMap<InstrutorModel, InstrutorResponseDTO>()
                .ForMember(dest => dest.TipoUsuario, opt => opt.MapFrom(src => src.PermissaoId))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status? "Ativo" : "Inativo"));

            // AULA MAPEAMENTO
            CreateMap<AulaCreateDTO, AulaModel>();

            CreateMap<AulaUpdateDTO, AulaModel>()
                .ReverseMap();

            CreateMap<AulaModel, AulaResponseDTO>()
                .ForMember(dest => dest.TipoAula, opt => opt.MapFrom(src => src.TipoAula.GetDescription()));

            //VEICULO MAPEAMENTO
            CreateMap<VeiculoCreateDTO, VeiculoModel>();

            CreateMap<VeiculoUpdateDTO, VeiculoModel>()
                .ReverseMap();

            CreateMap<VeiculoModel, VeiculoResponseDTO>()
                .ForMember(dest => dest.StatusVeiculo, opt => opt.MapFrom(src => src.StatusVeiculo ? "Ativo" : "Inativo"));

            //MATRICULA MAPEAMENTO
            CreateMap<MatriculaCreateDTO, MatriculaModel>();

            CreateMap<MatriculaUpdateDTO, MatriculaModel>()
                .ReverseMap();

            CreateMap<MatriculaModel, MatriculaResponseDTO>()
                .ForMember(dest => dest.StatusMatricula, opt => opt.MapFrom(src => src.StatusMatricula ? "Ativo" : "Inativo"))
                .ForMember(dest => dest.AlunoCpf, opt => opt.MapFrom(src => src.Aluno.Cpf))
                .ForMember(dest => dest.AlunoNome, opt => opt.MapFrom(src => src.Aluno.NomeCompleto))
                .ForMember(dest => dest.AlunoTelefone, opt => opt.MapFrom(src => src.Aluno.Telefone));

            //LOGIN MAPEAMENTO
            CreateMap<PessoaModel, LoginResponseDTO>()
              .ReverseMap()
              .ForMember(dest => dest.PermissaoId, opt => opt.ConvertUsing<TipoParaPermissaoIdConverter, string>(src => src.TipoUsuario));

            CreateMap<PessoaModel, LoginResponseDTO>()
               .ForMember(dest => dest.TipoUsuario, opt => opt.ConvertUsing<PermissaoIdParaTipoConverter, int>(src => src.PermissaoId));

            // PAGAMENTO MAPEAMENTO
            CreateMap<PagamentoCreateDTO, PagamentoModel>()
                .ForMember(dest => dest.StatusPagamento, opt => opt.Ignore()) // definido no service
                .ForMember(dest => dest.DataPagamento, opt => opt.Ignore()) // definido no service
                .ForMember(dest => dest.DataCriacao, opt => opt.Ignore()) // definido automaticamente
                .ForMember(dest => dest.DataAtualizacao, opt => opt.Ignore());

            CreateMap<PagamentoUpdateDTO, PagamentoModel>()
                .ForMember(dest => dest.DataAtualizacao, opt => opt.Ignore()) // definido no service
                .ReverseMap();

            CreateMap<PagamentoModel, PagamentoResponseDTO>()
                .ForMember(dest => dest.StatusPagamento, opt => opt.MapFrom(src => src.StatusPagamento.ToString()))
                .ForMember(dest => dest.NomeAluno, opt => opt.MapFrom(src => src.Aluno.NomeCompleto))
                .ForMember(dest => dest.CpfAluno, opt => opt.MapFrom(src => src.Aluno.Cpf))
                .ForMember(dest => dest.TotalParcelas, opt => opt.MapFrom(src => src.Parcelas.Count))
                .ForMember(dest => dest.ParcelasPagas, opt => opt.MapFrom(src => src.Parcelas.Count(p => p.StatusParcela == StatusParcelaEnum.Paga)))
                .ForMember(dest => dest.ParcelasPendentes, opt => opt.MapFrom(src => src.Parcelas.Count(p => p.StatusParcela == StatusParcelaEnum.Pendente)))
                .ForMember(dest => dest.ParcelasVencidas, opt => opt.MapFrom(src => src.Parcelas.Count(p => p.StatusParcela == StatusParcelaEnum.Vencida || (p.DataVencimento < DateTime.Today && p.StatusParcela == StatusParcelaEnum.Pendente))))
                .ForMember(dest => dest.ValorPago, opt => opt.MapFrom(src => src.Parcelas.Where(p => p.StatusParcela == StatusParcelaEnum.Paga).Sum(p => p.ValorPago ?? p.Valor)))
                .ForMember(dest => dest.ValorPendente, opt => opt.MapFrom(src => src.ValorTotal - src.Parcelas.Where(p => p.StatusParcela == StatusParcelaEnum.Paga).Sum(p => p.ValorPago ?? p.Valor)));

            // PARCELA MAPEAMENTO
            CreateMap<ParcelaCreateDTO, ParcelaModel>()
                .ForMember(dest => dest.StatusParcela, opt => opt.Ignore()) // definido no service
                .ForMember(dest => dest.DataCriacao, opt => opt.Ignore()) // definido automaticamente
                .ForMember(dest => dest.DataAtualizacao, opt => opt.Ignore())
                .ForMember(dest => dest.DataPagamento, opt => opt.Ignore())
                .ForMember(dest => dest.ValorPago, opt => opt.Ignore());

            CreateMap<ParcelaUpdateDTO, ParcelaModel>()
                .ForMember(dest => dest.DataAtualizacao, opt => opt.Ignore()) // definido no service
                .ReverseMap();

            CreateMap<ParcelaModel, ParcelaResponseDTO>()
                .ForMember(dest => dest.StatusParcela, opt => opt.MapFrom(src => src.StatusParcela.ToString()))
                .ForMember(dest => dest.DiasAtraso, opt => opt.MapFrom(src =>
                    src.DataVencimento < DateTime.Today && src.StatusParcela == StatusParcelaEnum.Pendente
                        ? (DateTime.Today - src.DataVencimento).Days
                        : 0))
                .ForMember(dest => dest.ValorTotal, opt => opt.MapFrom(src => src.Valor + (src.Juros ?? 0) + (src.Multa ?? 0)))
                .ForMember(dest => dest.EstaVencida, opt => opt.MapFrom(src =>
                    src.DataVencimento < DateTime.Today && src.StatusParcela == StatusParcelaEnum.Pendente));
        }
    }
}
