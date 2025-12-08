using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;
using Sotlaora.Business.Entities.UserMetadata;

namespace Sotlaora.Business.Entities
{
    public class User : IdentityUser<int>
    {
        public Role Role { get; set; }

        public DateTime CreatedAt { get; set; }

        public string Location { get; set; } = string.Empty;

        public bool IsOnline { get; set; }

        public DateTime? LastSeen { get; set; }


        public int? UserProfileId { get; set; }
        public UserProfile? UserProfile { get; set; }

        

        public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
        public ICollection<Order> Orders { get; set; } = new List<Order>();
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
        public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
    }
}