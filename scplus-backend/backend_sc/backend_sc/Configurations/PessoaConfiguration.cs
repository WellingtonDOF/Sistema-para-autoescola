using backend_sc.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend_sc.Configurations
{
    public class PessoaConfiguration : IEntityTypeConfiguration<PessoaModel>
    {
        public void Configure(EntityTypeBuilder<PessoaModel> builder)
        {
            builder.HasIndex(p => p.Cpf)
                .IsUnique();

            builder.HasOne(p => p.Permissao)
                .WithMany()
                .HasForeignKey(p => p.PermissaoId)
                .IsRequired();  
        }


    }
}
