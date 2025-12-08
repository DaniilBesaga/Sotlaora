namespace Sotlaora.Business.Entities
{
    
    public class Pro : User
    {
        public ICollection<ProSubcategory> ProSubcategories { get; set; } = new List<ProSubcategory>();
        public ICollection<Order> AssignedOrders { get; set; } = new List<Order>();
        public ICollection<Review> AssignedReviews { get; set; } = new List<Review>();

        public int? PortfolioId { get; set; }
        public ProPortfolio? Portfolio { get; set; }
    }
}