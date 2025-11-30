namespace Sotlaora.Business.Entities
{
    
    public class Pro : User
    {
        public ICollection<Subcategory> Subcategories { get; set; } = new List<Subcategory>();
        public ICollection<Order> AssignedOrders { get; set; } = new List<Order>();
        public ICollection<Review> AssignedReviews { get; set; } = new List<Review>();
    }
}