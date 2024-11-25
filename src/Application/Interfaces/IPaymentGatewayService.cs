namespace GreenRoom.Application.Interfaces;

public interface IPaymentGatewayService
{
    Task<string> CreatePaymentIntentAsync(decimal amount, string currency);
    Task<string> CapturePaymentIntentAsync(string paymentIntentId);
    Task<string> RefundPaymentIntentAsync(string paymentIntentId);
    string CreateProduct(string productName, string? description, decimal price);
    void UpdateProduct(string productId, string productName, string? description, decimal price);
    void DeleteProduct(string productId);
    string PreparePayment(string productId, string customerId);
}
