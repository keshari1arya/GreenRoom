using GreenRoom.Application.Interfaces;
using Stripe;
using Stripe.Checkout;

namespace GreenRoom.Infrastructure.Service;

public class StripeService : IPaymentGatewayService
{
    public StripeService(StripeClient stripeClient)
    {
        StripeConfiguration.ApiKey = stripeClient.ApiKey;
    }

    Task<string> IPaymentGatewayService.CreatePaymentIntentAsync(decimal amount, string currency)
    {
        throw new NotImplementedException();
    }

    public Task<string> CapturePaymentIntentAsync(string paymentIntentId)
    {
        throw new NotImplementedException();
    }

    public Task<string> RefundPaymentIntentAsync(string paymentIntentId)
    {
        throw new NotImplementedException();
    }

    public string CreateProduct(string productName, string? description, decimal price)
    {
        var options = new ProductCreateOptions
        {
            Name = productName,
            Description = description,
            DefaultPriceData = new ProductDefaultPriceDataOptions
            {
                Currency = "usd",
                UnitAmount = (long)price * 100,
            },
        };

        var service = new ProductService();
        var product = service.Create(options);
        return product.Id;
    }

    public void UpdateProduct(string productId, string productName, string? description, decimal price)
    {
        var options = new ProductUpdateOptions
        {
            Name = productName,
            Description = description,
        };

        var service = new ProductService();
        service.Update(productId, options);
    }

    public void DeleteProduct(string productId)
    {
        var service = new ProductService();
        service.Delete(productId);
    }

    public string PreparePayment(string productId, string customerEmail)
    {
        var productService = new ProductService();
        var product = productService.Get(productId);

        var opt = new SessionCreateOptions
        {
            LineItems =
            [
                new() {
                    Price = product.DefaultPriceId,
                    Quantity = 1,
                },
            ],
            Mode = "payment",
            SuccessUrl = "http://localhost:4200/subscription/success",
            CancelUrl = "http://localhost:4200/subscription",
            CustomerEmail = customerEmail,
        };

        var service = new SessionService();
        var session = service.Create(opt);

        return session.Url;
    }
}
