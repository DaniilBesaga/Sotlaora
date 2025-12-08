using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sotlaora.Business.Entities;

namespace Sotlaora.Infrastructure.Configuration
{
    public class ProConfiguration : IEntityTypeConfiguration<Pro>
    {
        public void Configure (EntityTypeBuilder<Pro> builder)
        {
            builder.HasMany(p=>p.AssignedOrders)
                .WithOne(o=>o.Pro)
                .HasForeignKey(o=>o.ProId)
                .OnDelete(DeleteBehavior.SetNull);

            builder.HasMany(p=>p.AssignedReviews)
                .WithOne(r=>r.Pro)
                .HasForeignKey(r=>r.ProId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(p=>p.Portfolio)
                .WithOne(up=>up.Pro)
                .HasForeignKey<ProPortfolio>(up=>up.ProId)
                .OnDelete(DeleteBehavior.Cascade);

            builder
                .HasMany(p => p.ProSubcategories)
                .WithOne(ps => ps.Pro)
                .HasForeignKey(ps => ps.ProId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}