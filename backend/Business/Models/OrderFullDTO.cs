using Business.Models;
using Sotlaora.Business.Entities;

namespace backend.Business.Models
{
    public class OrderFullDTO
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

        public DateTime? DeadlineDate { get; set; }

        public TimeOnly? DesiredTimeStart { get; set; }
        public TimeOnly? DesiredTimeEnd   { get; set; }

        public List<SubcategoryDTO> SubcategoriesDTO { get; set; } = new List<SubcategoryDTO>();

        public List<string> ImageFileRefs { get; set; } = new List<string>();

        public ClientDTO Client { get; set; } = null!;

        public OrderStatus Status { get; set; }
    }
}