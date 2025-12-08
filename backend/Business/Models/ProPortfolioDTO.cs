namespace Sotlaora.Business.Models
{
    public class ProPortfolioDTO
    {
        public string Description { get; set; } = string.Empty;
        public string? YoutubeLink { get; set; } = string.Empty;
        public int? ImageFileId { get; set; }
        public int SubcategoryId { get; set; }
        public string? ImageRef { get; set; } = string.Empty;
    }
}