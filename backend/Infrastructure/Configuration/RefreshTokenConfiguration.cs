using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sotlaora.Business.Entities;

namespace Sotlaora.Infrastructure.Configuration
{
    public class RefreshTokenConfiguration : IEntityTypeConfiguration<RefreshToken>
    {
        public void Configure(EntityTypeBuilder<RefreshToken> builder)
        {
            builder.ToTable("refresh_tokens");

            builder.HasKey(rt => rt.Id);

            builder.Property(rt => rt.TokenHash)
                   .HasColumnName("tokenHash")
                   .IsRequired()
                   .HasMaxLength(500);

            builder.Property(rt => rt.ExpiresAt)
                   .HasColumnName("expiresAt")
                   .IsRequired();

            builder.Property(rt => rt.IsUsed)
                   .HasColumnName("isUsed")
                   .IsRequired();

            builder.Property(rt => rt.IsRevoked)
                   .HasColumnName("isRevoked")
                   .IsRequired();

            builder.Property(rt => rt.CreatedAt)
                   .HasColumnName("createdAt")
                   .IsRequired();

            builder.Property(rt => rt.UserId)
                   .HasColumnName("userId")
                   .IsRequired();

            builder.HasOne(rt => rt.User)
                   .WithMany(u => u.RefreshTokens)
                   .HasForeignKey(rt => rt.UserId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(rt => rt.TokenHash)
                   .IsUnique()
                   .HasDatabaseName("IX_RefreshTokens_TokenHash");

            builder.HasIndex(rt => rt.UserId)
                   .HasDatabaseName("IX_RefreshTokens_UserId");
        }
    }
}
