using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sotlaora.Business.Entities;

namespace Sotlaora.Infrastructure.Configuration
{
    public class ImageConfiguration : IEntityTypeConfiguration<Image>
    {
        public void Configure(EntityTypeBuilder<Image> builder)
        {
            builder.ToTable("images");

            builder.HasKey(i => i.Id);

            builder.Property(i => i.Ref)
                   .HasColumnName("ref")
                   .IsRequired()
                   .HasMaxLength(500);

            builder.Property(i => i.Type)
                   .HasConversion<string>()
                   .HasColumnName("type")
                   .IsRequired();

            builder.Property(i => i.EntityType)
                   .HasConversion<string>()
                   .HasColumnName("entity_type")
                   .IsRequired();

            builder.Property(i => i.EntityId)
                   .HasColumnName("entity_id")
                   .IsRequired();

            builder.HasIndex(i => new { i.EntityType, i.EntityId })
                   .HasDatabaseName("IX_Images_EntityType_EntityId");
        }
    }
}
