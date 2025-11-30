
namespace Sotlaora.Business.Entities
{
    
    public class Subcategory
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;

        public int CategoryId { get; set; }
        public Category Category { get; set; } = null!;

        public ICollection<Pro> Pros { get; set; } = new List<Pro>();
        public ICollection<Order> Orders { get; set; } = new List<Order>();
    }
}