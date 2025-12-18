namespace Sotlaora.Business.Entities
{
    
    public enum OrderStatus
    {
        Draft,
        Active,
        Assigned,
        Discussion,
        WaitingForPayment,
        InProgress,
        Completed,
        Paid,
        WaitingForConfirmationByClient,
        WaitingForConfirmationByPro,
        CompletedByClient,
        CompletedByPro,
        CancelledByClient,
        CancelledByPro
    }
}