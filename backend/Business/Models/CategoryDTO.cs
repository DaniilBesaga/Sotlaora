public class CategoryDTO
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public List<SubcategoryDTO> Subcategories { get; set; } = new List<SubcategoryDTO>();
}