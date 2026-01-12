using backend.Business.Entities;
using backend.Infrastructure.Configuration;
using Business.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Sotlaora.Business.Entities;
using Sotlaora.Business.Entities.UserMetadata;
using Sotlaora.Business.Models;
using Sotlaora.Infrastructure.Configuration;

namespace Sotlaora.Infrastructure.Data
{
    public class AppDbContext : IdentityDbContext<User, AppRole, int>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<User> Clients { get; set; }
        public DbSet<Subcategory> Subcategories { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<Pro> Pros { get; set; }
        public DbSet<Image> Images { get; set; }
        public DbSet<Notification> Notifications { get; set; }

        public DbSet<ProSubcategory> ProSubcategories { get; set; }
        public DbSet<ProPortfolio> ProPortfolios { get; set; }
        public DbSet<UserProfile> UserProfiles { get; set; }

        public DbSet<Chat> Chats { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<MessageOffer> MessageOffers { get; set; }

        public DbSet<ProBid> ProBids { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.ApplyConfiguration(new CategoryConfiguration());
            builder.ApplyConfiguration(new ImageConfiguration());
            builder.ApplyConfiguration(new OrderConfiguration());
            builder.ApplyConfiguration(new ProConfiguration());
            builder.ApplyConfiguration(new RefreshTokenConfiguration());
            builder.ApplyConfiguration(new ReviewConfiguration());
            builder.ApplyConfiguration(new SubcategoryConfiguration());
            builder.ApplyConfiguration(new UserConfiguration());
            builder.ApplyConfiguration(new NotificationConfiguration());

            builder.ApplyConfiguration(new ProSubcategoryConfiguration());
            builder.ApplyConfiguration(new ProPortfolioConfiguration());
            builder.ApplyConfiguration(new UserProfileConfiguration());

            builder.ApplyConfiguration(new ChatConfiguration());
            builder.ApplyConfiguration(new MessageConfiguration());

            builder.ApplyConfiguration(new MessageOfferConfiguration());

            builder.ApplyConfiguration(new ProBidConfiguration());
            
            builder.Entity<User>()
                .HasDiscriminator<string>("UserType")
                .HasValue<User>("Client")
                .HasValue<Pro>("Pro");

            builder.Owned<NotificationMetadata>();
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
        }
    }
}