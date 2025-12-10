namespace backend.Business.Models
{
    public class SubcategoryDTOWithDesc: SubcategoryDTO
    {
        public string Description { get; set; } = string.Empty;
    }
}