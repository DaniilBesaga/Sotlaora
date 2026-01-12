using Sotlaora.Business.Entities;

namespace backend.Business.Entities
{
    public class ProBid
    {
        public int Id { get; set; }
        public int ProId { get; set; }
        public Pro Pro { get; set; } = null!;
        public int OrderId { get; set; }
        public Order Order { get; set; } = null!;
        public decimal BidAmount { get; set; }
        public string? Message { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}