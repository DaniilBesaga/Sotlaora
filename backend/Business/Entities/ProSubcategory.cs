using Sotlaora.Business.Enums.UserMetadata;

namespace Sotlaora.Business.Entities
{
    public class ProSubcategory
    {
        public int ProId { get; set; }
        public Pro Pro { get; set; } = null!;

        public int SubcategoryId { get; set; }
        public Subcategory Subcategory { get; set; } = null!;

        public decimal? Price { get; set; }
        public PriceType PriceType { get; set; }

        public string Description { get; set; } = string.Empty;
    }

}