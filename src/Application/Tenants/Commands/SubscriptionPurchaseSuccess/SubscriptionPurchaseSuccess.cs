using GreenRoom.Application.Common.Interfaces;
using GreenRoom.Application.Interfaces;
using GreenRoom.Application.Utility.Constants;
using GreenRoom.Domain.Entities.DigitalAssetManager;
using Microsoft.Extensions.Primitives;


namespace GreenRoom.Application.Tenants.Commands.SubscriptionPurchaseSuccess;

public record SubscriptionPurchaseSuccessCommand(StringValues Signature, string? JsonBody) : IRequest;

public class SubscriptionPurchaseSuccessCommandValidator : AbstractValidator<SubscriptionPurchaseSuccessCommand>
{
    public SubscriptionPurchaseSuccessCommandValidator()
    {
    }
}

public class SubscriptionPurchaseSuccessCommandHandler : IRequestHandler<SubscriptionPurchaseSuccessCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly IPaymentGatewayService _paymentGatewayService;
    private readonly IMultiTenancyService _multiTenancyService;

    public SubscriptionPurchaseSuccessCommandHandler(IApplicationDbContext context, IPaymentGatewayService paymentGatewayService, IMultiTenancyService multiTenancyService)
    {
        _context = context;
        _paymentGatewayService = paymentGatewayService;
        _multiTenancyService = multiTenancyService;
    }

    public async Task Handle(SubscriptionPurchaseSuccessCommand request, CancellationToken cancellationToken)
    {
        var stripeWebhookSecret = await _context.ApplicationConfigurations.FirstOrDefaultAsync(x => x.Key == ConfigurationKeys.StripeCheckoutSuccessWebhookKey, cancellationToken);
        Guard.Against.Null(stripeWebhookSecret, nameof(stripeWebhookSecret));

        var stripeProductId = _paymentGatewayService.ValidatePaymentAndGetProductId(request.Signature, request.JsonBody, stripeWebhookSecret.Value);
        var subscription = _context.Subscriptions.FirstOrDefault(x => x.StripeProductId == stripeProductId);
        TenantSubscription tenantSubscription = new()
        {
            SubscriptionId = subscription!.Id,
            TenantId = _multiTenancyService.CurrentTenantId,
            StartDate = DateTime.Now,
            // TODO: For now we are giving a month of subscription
            // We need to change this to variable subscription period
            EndDate = DateTime.Now.AddMonths(1)
        };
    }
}
