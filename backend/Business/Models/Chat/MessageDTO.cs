using backend.Business.Enums;

namespace Business.Models.Models
{
    public class MessageDTO
    {
        public int Id { get; set; }
        public string Content { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
        public bool IsRead { get; set; }
        public int SenderId { get; set; }
        public int ReceiverId { get; set; }
        public bool IsSystemMessage { get; set; } = false;

        public MessageType Type { get; set; } = MessageType.Text; 
        public decimal? OfferPrice { get; set; }
        public OfferStatus? OfferStatus { get; set; }
    }
}