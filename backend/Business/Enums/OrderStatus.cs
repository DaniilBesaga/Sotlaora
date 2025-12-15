namespace Sotlaora.Business.Entities
{
    
    public enum OrderStatus
    {
        Draft,
        Active,
        Assigned,
        Discussion,
        InProgress,
        Completed,
        Paid,
        WaitingForConfirmationByClient,
        CancelledByClient,
        CancelledByPro
    }
}