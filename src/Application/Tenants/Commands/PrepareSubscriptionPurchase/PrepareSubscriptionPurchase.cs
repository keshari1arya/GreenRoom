using GreenRoom.Application.Common.Extension;
using GreenRoom.Application.Common.Interfaces;
using GreenRoom.Application.Interfaces;

namespace GreenRoom.Application.Tenants.Commands.PrepareSubscriptionPurchase;

public record PrepareSubscriptionPurchaseCommand(int SubscriptionId) : IRequest<PrepareSubscriptionPurchaseDto>;

public class PrepareSubscriptionPurchaseCommandValidator : AbstractValidator<PrepareSubscriptionPurchaseCommand>
{
    public PrepareSubscriptionPurchaseCommandValidator(IApplicationDbContext context)
    {
        RuleFor(x => x.SubscriptionId)
            .IdMustExistInDatabase(context.Subscriptions);
    }
}

public class PrepareSubscriptionPurchaseCommandHandler : IRequestHandler<PrepareSubscriptionPurchaseCommand, PrepareSubscriptionPurchaseDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IPaymentGatewayService _paymentGatewayService;
    private readonly IUser _user;
    private readonly IMultiTenancyService _multiTenancyService;

    public PrepareSubscriptionPurchaseCommandHandler(IApplicationDbContext context, IPaymentGatewayService paymentGatewayService, IUser user, IMultiTenancyService multiTenancyService)
    {
        _context = context;
        _paymentGatewayService = paymentGatewayService;
        _user = user;
        _multiTenancyService = multiTenancyService;
    }

    public async Task<PrepareSubscriptionPurchaseDto> Handle(PrepareSubscriptionPurchaseCommand request, CancellationToken cancellationToken)
    {
        var subscription = await _context.Subscriptions.FindAsync(request.SubscriptionId, cancellationToken);
        // TODO: Make a strongly typed record for metadata
        var metadata = new Dictionary<string, string>{
            {"email", _user.Email ?? string.Empty},
            {"subscriptionId", subscription!.Id.ToString()},
            {"tenantId", _multiTenancyService.CurrentTenantId.ToString()}
        };

        return new PrepareSubscriptionPurchaseDto
        {
            PaymentUrl = _paymentGatewayService.PreparePayment(subscription!.StripeProductId!, _user.Email ?? string.Empty, metadata)
        };
    }
}

public class PrepareSubscriptionPurchaseDto
{
    public string PaymentUrl { get; set; } = string.Empty;
}