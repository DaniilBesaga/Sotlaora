namespace Business.Models.Models
{
    public class MessageDTO
    {
        public int Id { get; set; }
        public string Content { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
        public bool IsRead { get; set; }
        public Guid ChatId { get; set; }
    }
}