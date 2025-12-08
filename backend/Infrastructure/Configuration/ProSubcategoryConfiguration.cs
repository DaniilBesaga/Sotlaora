using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sotlaora.Business.Entities;

namespace Sotlaora.Infrastructure.Configuration
{
    public class ProSubcategoryConfiguration : IEntityTypeConfiguration<ProSubcategory>
    {
        public void Configure (EntityTypeBuilder<ProSubcategory> builder)
        {
            builder.ToTable("ProSubcategory");

            builder.Property(o => o.Price)
                   .HasColumnName("price")
                   .HasColumnType("decimal(18,2)");
            
            builder.Property(o => o.Description)
                   .HasColumnName("description")
                   .HasMaxLength(1000);
                   
            builder.HasKey(ps => new { ps.ProId, ps.SubcategoryId });

            builder
                .HasOne(ps => ps.Pro)
                .WithMany(p => p.ProSubcategories)
                .HasForeignKey(ps => ps.ProId)
                .OnDelete(DeleteBehavior.Cascade);

            builder
                .HasOne(ps => ps.Subcategory)
                .WithMany(s => s.ProSubcategories)
                .HasForeignKey(ps => ps.SubcategoryId)
                .OnDelete(DeleteBehavior.Cascade);

        }
    }
}