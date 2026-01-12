namespace Backend.Business.Models
{
    public class ReviewDTO
    {
        public int Id { get; set; }
        public string Text { get; set; } = string.Empty;
        public int Rating { get; set; }
        public string ClientName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }

        public string? ImageRef { get; set; }
        public string ProjectTitle { get; set; } = string.Empty;
    }
}