using backend.Business.Enums;

namespace backend.Business.Models
{
    public class SendMessageRequest
    {
        public string Content { get; set; } = string.Empty;
        public MessageType Type { get; set; } = MessageType.Text; // "text", "offer", "system"
        public decimal? Price { get; set; } // Nullable, only for offers
        public bool IsSystemMessage { get; set; } = false;
    }
}