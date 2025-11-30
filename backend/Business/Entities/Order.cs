
namespace Sotlaora.Business.Entities
{
    
    public class Order
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public DateTime PostedAt { get; set; }

        public decimal Price { get; set; }

        public Location Location { get; set; }
        public string Address { get; set; } = string.Empty;

        public double Distance { get; set; }
        public string AdditionalComment { get; set; } = string.Empty;

        public int ResponsesCount { get; set; }

        public DateTime? DeadlineDate { get; set; }

        public TimeOnly? DesiredTimeStart { get; set; }
        public TimeOnly? DesiredTimeEnd   { get; set; }

        public OrderStatus Status { get; set; }

        public ICollection<Subcategory> Subcategories { get; set; } = new List<Subcategory>();

        public int ClientId { get; set; }
        public User Client { get; set; } = null!;

        public int ProId { get; set; }
        public Pro Pro { get; set; } = null!;
    }
}