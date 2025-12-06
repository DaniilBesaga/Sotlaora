using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sotlaora.Business.Entities;

public class NotificationConfiguration : IEntityTypeConfiguration<Notification>
{
    public void Configure(EntityTypeBuilder<Notification> builder)
    {
        builder.ToTable("Notifications");

        builder.HasKey(x => x.Id);

        // Настройка обязательных полей
        builder.Property(x => x.Title)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(x => x.Message)
            .IsRequired()
            .HasMaxLength(1000);

        // Храним Enum как строку для читаемости в БД ('Assigned', 'Urgent')
        // Или уберите этот блок, чтобы хранить как int (0, 1, 2...)
        builder.Property(x => x.Type)
            .HasConversion<string>() 
            .IsRequired();

        builder.Property(x => x.CreatedAt)
            .HasDefaultValueSql("NOW()"); // Или NOW() для Postgres

        builder.Property(x => x.IsRead)
            .HasDefaultValue(true);

        builder.HasOne(x => x.User)
            .WithMany(n=>n.Notifications)
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.SetNull);

        // === МАППИНГ JSON (Самое важное) ===
        // Работает в EF Core 7 и 8+. 
        // Поле Meta будет храниться в одной колонке (nvarchar(max) или jsonb)
        builder.OwnsOne(x=>x.Meta, meta =>
        {
            meta.ToJson(); // Указывает EF что это JSON

            meta.Property(m=>m.OrderId).HasColumnName("order_id");
            meta.Property(m => m.ClientName).HasJsonPropertyName("client_name");
            meta.Property(m => m.Category).HasJsonPropertyName("category");
            meta.Property(m => m.Amount).HasJsonPropertyName("amount");
        });
    }
}