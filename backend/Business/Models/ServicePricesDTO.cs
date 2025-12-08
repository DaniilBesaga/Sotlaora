using Sotlaora.Business.Enums.UserMetadata;

namespace Sotlaora.Business.Models
{
    public class ServicePricesDTO
    {
        public decimal? Price { get; set; }
        public PriceType PriceType { get; set; }
        public SubcategoryDTO SubcategoryDTO { get; set; } = null!;
    }

    public class ServicePricesWithCategory
    {
        public string CategoryTitle { get; set;} = string.Empty;
        public List<ServicePricesDTO> ServicePrices { get; set; } = new List<ServicePricesDTO>();
    }
}