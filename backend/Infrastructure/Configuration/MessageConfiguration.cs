using backend.Business.Entities;
using Business.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Infrastructure.Configuration
{
    public class MessageConfiguration : IEntityTypeConfiguration<Message>
    {
        public void Configure(EntityTypeBuilder<Message> builder)
        {
            builder.HasKey(m => m.Id);

            builder.Property(m => m.Content)
                .IsRequired()
                .HasMaxLength(2000);

            builder.Property(m => m.Timestamp)
                .IsRequired();

            builder.Property(m => m.SenderId)
                .IsRequired();

            builder.Property(m => m.ReceiverId)
                .IsRequired();

            builder.Property(m => m.IsRead)
                .IsRequired()
                .HasDefaultValue(false);

            builder.Property(m => m.ChatId)
                .IsRequired();

            builder.Property(m => m.IsSystemMessage)
                .IsRequired()
                .HasDefaultValue(false);
        }
    }
}