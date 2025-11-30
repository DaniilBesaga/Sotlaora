using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sotlaora.Business.Entities;

namespace Sotlaora.Infrastructure.Configuration
{
    public class OrderConfiguration : IEntityTypeConfiguration<Order>
    {
        public void Configure(EntityTypeBuilder<Order> builder)
        {
            builder.ToTable("orders");

            builder.HasKey(o => o.Id);

            builder.Property(o => o.Title)
                   .HasColumnName("title")
                   .IsRequired()
                   .HasMaxLength(200);

            builder.Property(o => o.Description)
                   .HasColumnName("description")
                   .IsRequired();

            builder.Property(o => o.PostedAt)
                   .HasColumnName("postedAt")
                   .IsRequired();

            builder.Property(o => o.Price)
                   .HasColumnName("price")
                   .HasColumnType("decimal(18,2)")
                   .IsRequired();

            builder.Property(o => o.Location)
                   .HasConversion<string>()
                   .HasColumnName("location")
                   .IsRequired();

            builder.Property(o => o.Address)
                   .HasColumnName("address")
                   .HasMaxLength(300);

            builder.Property(o => o.Distance)
                   .HasColumnName("distance");

            builder.Property(o => o.ResponsesCount)
                   .HasColumnName("responsesCount");

            builder.Property(o => o.DeadlineDate)
                   .HasColumnName("deadlineDate");

            builder.Property(o => o.DesiredTimeStart)
                   .HasColumnName("desiredTimeStart");
               
            builder.Property(o => o.DesiredTimeEnd)
                   .HasColumnName("desiredTimeEnd");

            builder.Property(o => o.Status)
                   .HasConversion<string>()
                   .HasColumnName("status")
                   .IsRequired();

            builder.HasOne(o => o.Client)
                   .WithMany(u => u.Orders)
                   .HasForeignKey(o => o.ClientId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(o => o.Pro)
                   .WithMany(p=>p.AssignedOrders) 
                   .HasForeignKey(o => o.ProId)
                   .OnDelete(DeleteBehavior.SetNull);

            builder.HasMany(o => o.Subcategories)
                    .WithMany(s => s.Orders);
        }
    }
}
