using Sotlaora.Business.Entities;
using Sotlaora.Business.Models;

namespace backend.Business.Models
{
    public class ProPublicProfile : ProDTO
    {
        public List<Review> Reviews { get; set; } = new List<Review>();
        public int ReviewsCount { get; set; }
        public double Rating { get; set; }
        public string Bio { get; set; } = string.Empty;
        public decimal? Price { get; set; }
        public int CompletedOrdersCount { get; set; }
    }
}