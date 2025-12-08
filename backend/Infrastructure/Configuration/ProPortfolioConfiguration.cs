using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sotlaora.Business.Entities;

namespace Sotlaora.Infrastructure.Configuration
{
    public class ProPortfolioConfiguration : IEntityTypeConfiguration<ProPortfolio>
    {
        public void Configure(EntityTypeBuilder<ProPortfolio> builder)
        {
            builder.ToTable("pro_portfolios");

            builder.HasKey(p => p.Id);

            builder.Property(p => p.Id)
                .ValueGeneratedOnAdd();

            builder.Property(p => p.Description)
                .IsRequired(false);

            builder.Property(p => p.YoutubeLink)
                .IsRequired(false);

            builder.Property(p => p.SubcategoryId)
                .IsRequired();

            builder.Property(p => p.ProId)
                .IsRequired();

            builder.HasOne(p => p.Subcategory)
                .WithMany()
                .HasForeignKey(p => p.SubcategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(p => p.Pro)
                .WithOne(p => p.Portfolio)
                .HasForeignKey<Pro>(p => p.PortfolioId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}