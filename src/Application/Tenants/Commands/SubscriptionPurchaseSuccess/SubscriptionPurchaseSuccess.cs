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
        var stripeWebhookSecret = await _context.ApplicationConfigurations.AsNoTracking().FirstOrDefaultAsync(x => x.Key == ConfigurationKeys.StripeCheckoutSuccessWebhookKey, cancellationToken);
        Guard.Against.Null(stripeWebhookSecret, nameof(stripeWebhookSecret));
        var metaData = _paymentGatewayService.ValidatePaymentAndGetSessionMetadata(request.Signature, request.JsonBody, stripeWebhookSecret.Value);
        TenantSubscription tenantSubscription = new()
        {
            SubscriptionId = Convert.ToInt32(metaData["subscriptionId"]),
            TenantId = Guid.Parse(metaData["tenantId"]),
            StartDate = DateTime.Now,
            // TODO: For now we are giving a month of subscription
            // We need to change this to variable subscription period
            EndDate = DateTime.Now.AddMonths(1)
        };
        await _context.TenantSubscriptions.AddAsync(tenantSubscription, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
