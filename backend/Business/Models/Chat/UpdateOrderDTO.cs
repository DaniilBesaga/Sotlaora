using Sotlaora.Business.Entities;

namespace Business.Models.Chat
{
    public class UpdateOrderDTO
    {
        public decimal Price { get; set; }
        public OrderStatus Status { get; set; } 
    }
}