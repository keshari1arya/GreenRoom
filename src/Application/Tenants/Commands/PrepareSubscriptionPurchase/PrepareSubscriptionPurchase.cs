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

    public PrepareSubscriptionPurchaseCommandHandler(IApplicationDbContext context, IPaymentGatewayService paymentGatewayService, IUser user)
    {
        _context = context;
        _paymentGatewayService = paymentGatewayService;
        _user = user;
    }

    public async Task<PrepareSubscriptionPurchaseDto> Handle(PrepareSubscriptionPurchaseCommand request, CancellationToken cancellationToken)
    {
        var subscription = await _context.Subscriptions.FindAsync(request.SubscriptionId, cancellationToken);


        return new PrepareSubscriptionPurchaseDto
        {
            PaymentUrl = _paymentGatewayService.PreparePayment(subscription!.StripeProductId!, _user.Email ?? string.Empty)
        };
    }
}

public class PrepareSubscriptionPurchaseDto
{
    public string PaymentUrl { get; set; } = string.Empty;
}