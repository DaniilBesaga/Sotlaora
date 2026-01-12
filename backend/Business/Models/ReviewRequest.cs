namespace Backend.Business.Models
{
    public class ReviewRequest
    {
        public string Text { get; set; } = string.Empty;
        public int Rating { get; set; }
        public int OrderId { get; set;}
    }
}