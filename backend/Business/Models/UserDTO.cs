using Sotlaora.Business.Entities;

namespace Sotlaora.Business.Models
{
    public class UserDTO
    {
        public int Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public Role Role { get; set; }
    }
}