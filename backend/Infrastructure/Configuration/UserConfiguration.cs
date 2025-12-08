using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sotlaora.Business.Entities;
using Sotlaora.Business.Entities.UserMetadata;

namespace Sotlaora.Infrastructure.Configuration
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.ToTable("users");

            builder.HasKey(u => u.Id);

            builder.Property(u => u.Role)
                .HasConversion<string>()
                .HasColumnName("role")
                .IsRequired();

            builder.Property(u => u.CreatedAt)
                .HasColumnName("created_at")
                .IsRequired();

            builder.Property(u => u.Location)
                .HasColumnName("location")
                .HasMaxLength(200)
                .IsRequired();

            builder.Property(u => u.IsOnline)
                .HasColumnName("is_online")
                .HasDefaultValue(false);

            builder.Property(u => u.LastSeen)
                .HasColumnName("lastSeen");

            builder.HasMany(u=>u.RefreshTokens)
                .WithOne(rt=>rt.User)
                .HasForeignKey(rt=>rt.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(u => u.Orders)
                .WithOne(o=>o.Client)
                .HasForeignKey(o => o.ClientId)
                .OnDelete(DeleteBehavior.SetNull);

            builder.HasMany(u => u.Reviews)
                .WithOne(o=>o.Client)
                .HasForeignKey(o => o.ClientId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(u => u.Notifications)
                .WithOne(n => n.User)
                .HasForeignKey(n => n.UserId)
                .OnDelete(DeleteBehavior.SetNull);

            builder.HasOne(u => u.UserProfile)
                .WithOne(pp => pp.User)
                .HasForeignKey<UserProfile>(pp => pp.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
