using Backend.Business.Models;
using Sotlaora.Business.Models;

namespace backend.Business.Models
{
    public class ProBidDTO
    {
        public int Id { get; set; }
        public int ProId { get; set; }
        public string ProName { get; set; } = string.Empty;
        public string? ProImageUrl { get; set; } = string.Empty;
        public double Rating { get; set; }
        public int ReviewsCount { get; set; }
        public decimal Price { get; set; }
        public string? Message { get; set; }
        public DateTime SubmittedAt { get; set; }
    }
}