namespace Sotlaora.Backend.Business.Entities
{
    public class ProCard
    {
        public int Id { get; set; }
        public int ProId { get; set; }

        public string UserName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string ImageRef { get; set; } = string.Empty;
        public List<SubcategoryDTO> SubcategoriesDTO { get; set; } = new List<SubcategoryDTO>();
        public string Location { get; set; } = string.Empty;
        public decimal? Price { get; set; }
        public double Rating { get; set; }
        public int ReviewsCount { get; set; } 
        public bool VerifiedIdentity { get; set; }
    }
}