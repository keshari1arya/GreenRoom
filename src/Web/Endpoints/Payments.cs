using GreenRoom.Application.Tenants.Commands.SubscriptionPurchaseSuccess;

namespace GreenRoom.Web.Endpoints;

public class Payments : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .MapPost(PaymentSuccess, "PaymentSuccess");
    }

    private async Task PaymentSuccess(HttpContext httpContext, ISender sender)
    {
        var json = await new StreamReader(httpContext.Request.Body).ReadToEndAsync();
        var sigHeader = httpContext.Request.Headers["Stripe-Signature"];

        var subscriptionCommand = new SubscriptionPurchaseSuccessCommand(sigHeader, json);

        await sender.Send(subscriptionCommand);
    }
}
