using Business.Entities;
using Sotlaora.Business.Entities;

namespace backend.Business.Entities
{
    public class Chat
    {
        public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public ICollection<Message> Messages { get; set; } = new List<Message>();

        public int ClientId { get; set; }
        public User Client { get; set; } = null!;

        public int ProId { get; set; }
        public Pro Pro { get; set; } = null!;

        public int OrderId { get; set; }
        public Order Order { get; set; } = null!;
    }
}