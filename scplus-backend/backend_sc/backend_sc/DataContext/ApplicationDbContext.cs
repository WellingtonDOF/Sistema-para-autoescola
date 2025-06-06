using AutoMapper;
using backend_sc.Configurations;
using backend_sc.Enums;
using backend_sc.Models;
using Microsoft.EntityFrameworkCore;
using backend_sc.Security;

namespace backend_sc.DataContext
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<PessoaModel> Pessoas { get; set; }
        public DbSet<AlunoModel> Alunos { get; set; }
        public DbSet<InstrutorModel> Instrutores { get; set; }
        public DbSet<PermissaoModel> Permissoes { get; set; }
        public DbSet<AulaModel> Aula{ get; set; }
        public DbSet<VeiculoModel> Veiculo { get; set; }
        public DbSet<MatriculaModel> Matricula { get; set; }
        public DbSet<PagamentoModel> Pagamentos { get; set; }
        public DbSet<ParcelaModel> Parcelas { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configura a estratégia TPT para a hierarquia de Pessoa (tabelas separadas)
            modelBuilder.Entity<PessoaModel>().UseTptMappingStrategy();
            modelBuilder.Entity<AlunoModel>().ToTable("Alunos");
            modelBuilder.Entity<InstrutorModel>().ToTable("Instrutores");

            //Configuração de Pessoa
            modelBuilder.ApplyConfiguration(new PessoaConfiguration());

            //Cria as permissões sempre que o banco for criado
            modelBuilder.Entity<PermissaoModel>().HasData(
            new PermissaoModel { Id = 1, TipoPermissao = TipoPermissaoEnum.Aluno },
            new PermissaoModel { Id = 2, TipoPermissao = TipoPermissaoEnum.Instrutor },
            new PermissaoModel { Id = 3, TipoPermissao = TipoPermissaoEnum.Admin });

            //Cria os tipos de aula definidos sempre que iniciar o banco.
            modelBuilder.Entity<AulaModel>().HasData(
            new AulaModel { Id = 1, TipoAula = TipoAulaEnum.Simulado, Descricao = "" },
            new AulaModel { Id = 2, TipoAula = TipoAulaEnum.Pratica, Descricao = "" },
            new AulaModel { Id = 3, TipoAula = TipoAulaEnum.Teorica, Descricao = "" },
            new AulaModel { Id = 4, TipoAula = TipoAulaEnum.Prova, Descricao = "" });

            var customPasswordHasher = new PasswordHasher(); // Tem que instanciar aqui, não pode no constructor, então da um B.O lascado...

            modelBuilder.Entity<PessoaModel> ().HasData(new PessoaModel
            {
                Id = 1,
                NomeCompleto = "AdminDefault",
                Cpf = "00000000000",
                Endereco = "RuaDefault",
                Telefone = "0000000000",
                Email = "Default@sistema.com",
                DataNascimento = DateTime.Now,
                PermissaoId = (int)TipoPermissaoEnum.Admin,
                Status = true,
                Senha = customPasswordHasher.Hash("admin0123")
            });

            // Configuração de Pagamento
            modelBuilder.ApplyConfiguration(new PagamentoConfiguration());

            // Configuração de Parcela
            modelBuilder.ApplyConfiguration(new ParcelaConfiguration());
        }
    }
}