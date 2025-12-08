
namespace Sotlaora.Business.Entities
{
    
    public class Subcategory
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;

        public int CategoryId { get; set; }
        public Category Category { get; set; } = null!;

        public ICollection<ProSubcategory> ProSubcategories { get; set; } = new List<ProSubcategory>();
        public ICollection<Order> Orders { get; set; } = new List<Order>();
        public ICollection<ProPortfolio> ProPortfolios { get; set; } = new List<ProPortfolio>();
    }
}