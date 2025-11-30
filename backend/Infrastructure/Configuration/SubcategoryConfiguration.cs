using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sotlaora.Business.Entities;

namespace Sotlaora.Infrastructure.Configuration
{
    public class SubcategoryConfiguration : IEntityTypeConfiguration<Subcategory>
    {
        public void Configure(EntityTypeBuilder<Subcategory> builder)
        {
            builder.ToTable("subcategories");

            builder.HasKey(s => s.Id);

            builder.Property(s => s.Title)
                   .HasColumnName("title")
                   .IsRequired()
                   .HasMaxLength(200);

            builder.Property(s => s.Slug)
                   .HasColumnName("slug")
                   .IsRequired()
                   .HasMaxLength(200);

            builder.Property(s => s.CategoryId)
                   .HasColumnName("categoryId")
                   .IsRequired();

            builder.HasOne(s => s.Category)
                   .WithMany(c => c.Subcategories)
                   .HasForeignKey(s => s.CategoryId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(s => s.Pros)
                   .WithMany(p => p.Subcategories);

            builder.HasMany(s => s.Orders)
                   .WithMany(o => o.Subcategories);
                   
        }
    }
}
