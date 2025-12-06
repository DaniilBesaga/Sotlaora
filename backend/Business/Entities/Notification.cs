using Sotlaora.Business.Enums;
using Sotlaora.Business.Models;

namespace Sotlaora.Business.Entities
{
    public class Notification
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public NotificationType Type { get; set; } // e.g., "urgent", "info", "setup_required"
        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; }

        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public NotificationMetadata Meta { get; set; } = new();
    }
}