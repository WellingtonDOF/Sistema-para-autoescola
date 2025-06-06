using backend_sc.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend_sc.Configurations
{
    public class PagamentoConfiguration : IEntityTypeConfiguration<PagamentoModel>
    {
        public void Configure(EntityTypeBuilder<PagamentoModel> builder)
        {
            builder.HasKey(e => e.Id);
            builder.Property(e => e.ValorTotal).HasPrecision(10, 2);
            builder.Property(e => e.StatusPagamento).HasConversion<string>();

            // Relacionamento com Aluno
            builder.HasOne(e => e.Aluno)
                  .WithMany()
                  .HasForeignKey(e => e.AlunoId)
                  .OnDelete(DeleteBehavior.Restrict);

            // Relacionamento com Parcelas
            builder.HasMany(e => e.Parcelas)
                          .WithOne(p => p.Pagamento)
                          .HasForeignKey(p => p.PagamentoId)
                          .OnDelete(DeleteBehavior.Cascade);
        }
    }
}