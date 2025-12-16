using Sotlaora.Business.Entities;

namespace backend.Business.Models
{
    public class ChatInfoDTO
    {
        public OrderFullDTO FullOrder { get; set; } = null!;
        public string AvatarClient { get; set; } = string.Empty;
        public string AvatarPro { get; set; } = string.Empty;
        public int ClientId { get; set; }
        public int ProId { get; set; } 
        public string ClientName { get; set; } = string.Empty;
        public string ProName { get; set; } = string.Empty;
    }
}