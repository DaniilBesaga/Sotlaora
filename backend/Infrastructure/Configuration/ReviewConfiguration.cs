using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sotlaora.Business.Entities;

namespace Sotlaora.Infrastructure.Configuration
{
    public class ReviewConfiguration : IEntityTypeConfiguration<Review>
    {
        public void Configure(EntityTypeBuilder<Review> builder)
        {
            builder.ToTable("reviews");

            builder.HasKey(r => r.Id);

            builder.Property(r => r.Stars)
                   .HasColumnName("stars")
                   .IsRequired();

            builder.Property(r => r.Comment)
                   .HasColumnName("comment")
                   .IsRequired()
                   .HasMaxLength(1000);

            builder.Property(r => r.CreatedAt)
                   .HasColumnName("created_at")
                   .IsRequired();

            builder.HasOne(r => r.Client)
                   .WithMany(u => u.Reviews)
                   .HasForeignKey(r => r.ClientId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(r => r.Pro)
                   .WithMany(p => p.AssignedReviews)
                   .HasForeignKey(r => r.ProId)
                   .OnDelete(DeleteBehavior.Restrict); 

            builder.HasIndex(r => new { r.ProId, r.ClientId })
                   .HasDatabaseName("IX_Reviews_Pro_Client");

            builder.HasIndex(r => r.OrderId)
                   .HasDatabaseName("IX_Reviews_Order");
        }
    }
}
