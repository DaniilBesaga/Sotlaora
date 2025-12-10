using Sotlaora.Business.Entities;

namespace backend.Business.Models
{
    public class SubcategoryDTOWithCountBio
    {
        public List<SubcategoryDTOWithDesc> SubcategoryDTOs { get; set;} = new List<SubcategoryDTOWithDesc>();
        public int Count { get; set; }
        public string Bio { get; set; } = string.Empty;
    }
}