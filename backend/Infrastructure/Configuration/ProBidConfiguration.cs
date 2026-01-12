using backend.Business.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sotlaora.Business.Entities;

namespace Sotlaora.Infrastructure.Configuration
{
    public class ProBidConfiguration : IEntityTypeConfiguration<ProBid>
    {
        public void Configure(EntityTypeBuilder<ProBid> builder)
        {
            builder.ToTable("pro_bids");

            builder.HasKey(pb => pb.Id);

            builder.Property(pb => pb.ProId)
                .HasColumnName("pro_id")
                .IsRequired();

            builder.Property(pb => pb.OrderId)
                .HasColumnName("order_id")
                .IsRequired();

            builder.Property(pb => pb.BidAmount)
                .HasColumnName("bid_amount")
                .HasColumnType("decimal(18,2)")
                .IsRequired();

            builder.Property(pb => pb.Message)
                .HasColumnName("message")
                .HasMaxLength(1000);

            builder.Property(pb => pb.CreatedAt)
                .HasColumnName("created_at")
                .IsRequired();

            builder.HasOne(pb => pb.Pro)
                .WithMany()
                .HasForeignKey(pb => pb.ProId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(pb => pb.Order)
                .WithMany()
                .HasForeignKey(pb => pb.OrderId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
