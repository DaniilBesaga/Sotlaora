namespace backend.Business.Models
{
    public class UpdateServiceDescriptionDto
    {
        public int SubcategoryId { get; set; }
        public string? Description { get; set; } = string.Empty;
    }
}