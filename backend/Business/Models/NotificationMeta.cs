namespace Sotlaora.Business.Models
{
    public class NotificationMetadata
    {
        // Для типа Assigned / Urgent
        public long? OrderId { get; set; }
        public string? ClientName { get; set; }

        // Для типа NewOrder
        public string? Category { get; set; }

        // Для типа Completed
        public string? Amount { get; set; } // Строка, т.к. на фронте "+ 2000 ₴"
    }
}