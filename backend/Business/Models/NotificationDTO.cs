using Sotlaora.Business.Enums;

namespace Sotlaora.Business.Models
{
    public class NotificationDTO
    {
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public NotificationType Type { get; set; }
    }
}