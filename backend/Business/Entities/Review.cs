using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Sotlaora.Business.Entities
{
    
    public class Review
    {
        public int Id { get; set; }

        public int Stars { get; set; }

        public string Comment { get; set; } = string.Empty;

        public int ClientId { get; set; }
        public User Client { get; set; } = null!;

        public int OrderId { get; set; }
        public Order Order { get; set; } = null!;

        public int ProId { get; set; }
        public Pro Pro { get; set; } = null!;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}