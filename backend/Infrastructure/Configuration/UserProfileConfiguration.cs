using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sotlaora.Business.Entities.UserMetadata;
using NetTopologySuite.Geometries;
using Sotlaora.Business.Enums.UserMetadata;

namespace Sotlaora.Infrastructure.Configuration
{
    public class UserProfileConfiguration : IEntityTypeConfiguration<UserProfile>
    {
        public void Configure(EntityTypeBuilder<UserProfile> builder)
        {
            builder.ToTable("user_profiles");

            builder.HasKey(up => up.Id);

            builder.Property(up => up.Id)
                .ValueGeneratedOnAdd();

            builder.Property(up => up.PhoneNumber)
                .IsRequired(false)
                .HasMaxLength(30);

            builder.Property(up => up.City)
                .IsRequired(false)
                .HasMaxLength(100);

            builder.Property(up => up.Address)
                .IsRequired(false)
                .HasMaxLength(500);

            builder.Property(up => up.DateOfBirth)
                .IsRequired();

            builder.Property(up => up.Gender)
                .IsRequired()
                .HasDefaultValue(Gender.Male)
                .HasConversion<int>();

            builder.Property(up => up.Bio)
                .HasMaxLength(1000);

            builder.Property(up => up.Location)
                .IsRequired(false)
                .HasColumnType("geography (point, 4326)");

            builder.Property(up => up.UserId)
                .IsRequired();

            builder.HasOne(up => up.User)
                .WithOne()
                .HasForeignKey<UserProfile>(up => up.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(up => up.UserId)
                .IsUnique();
        }
    }
}