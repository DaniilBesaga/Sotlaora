using backend.Business.Entities;
using backend.Business.Enums;
using Business.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Infrastructure.Configuration
{
    public class MessageOfferConfiguration : IEntityTypeConfiguration<MessageOffer>
    {
        public void Configure(EntityTypeBuilder<MessageOffer> builder)
        {
            builder.HasKey(o => o.MessageId);

            // One-to-One: Message → MessageOffer
            builder.HasOne(o => o.Message)
                   .WithOne()
                   .HasForeignKey<MessageOffer>(o => o.MessageId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.Property(o => o.Price)
                   .IsRequired()
                   .HasColumnType("decimal(18,2)");

            // Status enum
            builder.Property(o => o.Status)
                   .IsRequired()
                   .HasConversion<string>()
                   .HasDefaultValue(OfferStatus.Pending);

            // Optional: table name (recommended)
            builder.ToTable("MessageOffers");
        }
    }
}
