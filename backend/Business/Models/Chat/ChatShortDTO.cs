namespace Business.Models.Chat
{
    public class ChatShortDTO
    {
        public Guid Id { get; set; }
        public string ClientName { get; set; } = string.Empty;
        public string Avatar { get; set; } = string.Empty;
        public int OrderId { get; set; }
        public string OrderTitle { get; set; } = string.Empty;
        public string LastMessage { get; set; } = string.Empty;
        public string Time { get; set; } = string.Empty;
        public bool Unread { get; set; } = false;
    }
}