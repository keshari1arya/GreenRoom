namespace GreenRoom.Domain.Entities.DigitalAssetManager;

public class Payment : BaseAuditableEntity
{
    public string PaymentIntentId { get; set; } = string.Empty;
    public string PaymentMethodId { get; set; } = string.Empty;
    public string PaymentMethodType { get; set; } = string.Empty;
    public string PaymentStatus { get; set; } = string.Empty;
    public string PaymentAmount { get; set; } = string.Empty;
    public string PaymentCurrency { get; set; } = string.Empty;
    public string PaymentDescription { get; set; } = string.Empty;
    public string PaymentReceiptUrl { get; set; } = string.Empty;
    public string PaymentFailureCode { get; set; } = string.Empty;
    public string PaymentFailureMessage { get; set; } = string.Empty;
    public string PaymentRefundId { get; set; } = string.Empty;
    public string PaymentRefundStatus { get; set; } = string.Empty;
    public string PaymentRefundAmount { get; set; } = string.Empty;
    public string PaymentRefundCurrency { get; set; } = string.Empty;
    public string PaymentRefundFailureCode { get; set; } = string.Empty;
    public string PaymentRefundFailureMessage { get; set; } = string.Empty;
    public string PaymentRefundReceiptUrl { get; set; } = string.Empty;
    public string PaymentRefundFailureBalanceTransaction { get; set; } = string.Empty;
    public string PaymentRefundFailurePaymentIntent { get; set; } = string.Empty;
    public string PaymentRefundFailureReason { get; set; } = string.Empty;
    public string PaymentRefundFailureType { get; set; } = string.Empty;
    public string PaymentRefundFailureCharge { get; set; } = string.Empty;
    public string PaymentRefundFailureCodeCharge { get; set; } = string.Empty;
    public string PaymentRefundFailureCodePaymentIntent { get; set; } = string.Empty;
    public string PaymentRefundFailureCodeReason { get; set; } = string.Empty;
    public string PaymentRefundFailureCodeType { get; set; } = string.Empty;
}
