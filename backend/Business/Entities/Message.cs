using backend.Business.Entities;

namespace Business.Entities
{
    public class Message
    {
        public int Id { get; set; }
        public string Content { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; } = DateTime.Now;
        public int SenderId { get; set; }
        public int ReceiverId { get; set; }
        public bool IsRead { get; set; } = false;

        public Guid ChatId { get; set; }
        public Chat Chat { get; set; } = null!;

        public bool IsSystemMessage { get; set; } = false;

    }
}