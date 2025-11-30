using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sotlaora.Business.Entities;

namespace Sotlaora.Infrastructure.Configuration
{
    public class CategoryConfiguration : IEntityTypeConfiguration<Category>
    {
        public void Configure(EntityTypeBuilder<Category> builder)
        {
            builder.ToTable("categories");

            builder.HasKey(c => c.Id);

            builder.Property(c => c.Title)
                   .HasColumnName("title")
                   .IsRequired()
                   .HasMaxLength(200);

            builder.Property(c => c.Slug)
                   .HasColumnName("slug")
                   .IsRequired()
                   .HasMaxLength(200);


            builder.HasMany(c => c.Subcategories)
                   .WithOne(s => s.Category)
                   .HasForeignKey(s => s.CategoryId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(c => c.Slug)
                   .IsUnique()
                   .HasDatabaseName("IX_Categories_Slug");
        }
    }
}
