using backend_sc.Models;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace backend_sc.Configurations
{
    public class ParcelaConfiguration : IEntityTypeConfiguration<ParcelaModel>
    {
        public void Configure(EntityTypeBuilder<ParcelaModel> builder)
        {
            builder.HasKey(e => e.Id);
            builder.Property(e => e.Valor).HasPrecision(10, 2);
            builder.Property(e => e.ValorPago).HasPrecision(10, 2);
            builder.Property(e => e.Juros).HasPrecision(10, 2);
            builder.Property(e => e.Multa).HasPrecision(10, 2);
            builder.Property(e => e.StatusParcela).HasConversion<string>();
        }
    }
}
