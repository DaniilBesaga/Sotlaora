namespace Sotlaora.Business.Entities
{
    public class ProPortfolio
    {
        public int Id { get; set; }
        public string Description { get; set; } = string.Empty;
        public string? YoutubeLink { get; set; } = string.Empty;

        public int SubcategoryId { get; set; }
        public Subcategory Subcategory { get; set; } = null!;

        public int ProId { get; set; }
        public Pro Pro { get; set; } = null!;
    }
}