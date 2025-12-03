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
        public DateTime? LastSeen { get; set; }
        public List<Subcategory> Subcategories { get; set; } = new List<Subcategory>();
        public List<Order> Orders { get; set; } = new List<Order>();
    }

}