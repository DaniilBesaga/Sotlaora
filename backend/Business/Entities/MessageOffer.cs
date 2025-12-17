using backend.Business.Enums;
using Business.Entities;

namespace backend.Business.Entities
{
    public class MessageOffer
    {
        // Primary Key & Foreign Key pointing to Message.Id
        public int MessageId { get; set; }
        
        // Navigation back to parent
        public Message Message { get; set; } = null!;

        public decimal Price { get; set; }
        public OfferStatus Status { get; set; } = OfferStatus.Pending;
    }
}