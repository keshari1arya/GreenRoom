using GreenRoom.Application.Tenants.Commands.SubscriptionPurchaseSuccess;

namespace GreenRoom.Web.Endpoints;

public class Payments : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .MapPost(PaymentSuccess, "PaymentSuccess");
    }

    public async Task PaymentSuccess(ISender sender, HttpContext httpContext)
    {
        var json = await new StreamReader(httpContext.Request.Body).ReadToEndAsync();
        var sigHeader = httpContext.Request.Headers["Stripe-Signature"];

        var subscriptionCommand = new SubscriptionPurchaseSuccessCommand(sigHeader, json);

        await sender.Send(subscriptionCommand);
    }
}
