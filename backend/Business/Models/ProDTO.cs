using Sotlaora.Business.Entities;

namespace Sotlaora.Business.Models
{
    public class ProDTO
    {
        public int Id { get; set; }
        public string Email { get; set; } = null!;
        public string UserName { get; set; } = null!;
        public Role Role { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? Location { get; set; }
        public bool IsOnline { get; set; }
        public string? ImageRef { get; set; }
        public string? PhoneNumber { get; set; }
        public bool VerifiedIdentity { get; set; }
        public DateTime? LastSeen { get; set; }
        public List<SubcategoryDTO> ProSubcategories { get; set; } = new List<SubcategoryDTO>();
        public List<Order> Orders { get; set; } = new List<Order>();
    }

}