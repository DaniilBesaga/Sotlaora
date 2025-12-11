using Backend.Business.Models;
using Sotlaora.Business.Entities;

namespace Business.Models
{
    public class ClientDTO
    {
        public int Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public Role Role { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? Location { get; set; }
        public bool IsOnline { get; set; }
        public DateTime? LastSeen { get; set; }
        public string? ImageRef { get; set; }
        public string? PhoneNumber { get; set; }
        public List<OrderDTO> Orders { get; set; } = new List<OrderDTO>();
    }
}