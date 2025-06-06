using backend_sc.Models;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace backend_sc.Configurations
{
    public class VeiculoConfiguration : IEntityTypeConfiguration<VeiculoModel>
    {
        public void Configure(EntityTypeBuilder<VeiculoModel> builder)
        {
            builder.HasIndex(p => p.Placa)
                .IsUnique();
        }
    }
}

