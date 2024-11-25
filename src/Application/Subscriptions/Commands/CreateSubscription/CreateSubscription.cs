using GreenRoom.Application.Common.Interfaces;
using GreenRoom.Application.Interfaces;
using GreenRoom.Domain.Entities.DigitalAssetManager;

namespace GreenRoom.Application.Subscriptions.Commands.CreateSubscription;

public record CreateSubscriptionCommand(
    string Name,
    string? Description,
    decimal Price,
    bool IsActive
) : IRequest<int>;

public class CreateSubscriptionCommandValidator : AbstractValidator<CreateSubscriptionCommand>
{
    public CreateSubscriptionCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .MaximumLength(256);

        RuleFor(x => x.Price)
            .GreaterThan(0);

        RuleFor(x => x.Description)
            .MinimumLength(10);
    }
}

public class CreateSubscriptionCommandHandler : IRequestHandler<CreateSubscriptionCommand, int>
{
    private readonly IApplicationDbContext _context;
    private readonly IPaymentGatewayService _paymentGatewayService;

    public CreateSubscriptionCommandHandler(IApplicationDbContext context, IPaymentGatewayService paymentGatewayService)
    {
        _context = context;
        _paymentGatewayService = paymentGatewayService;
    }

    public async Task<int> Handle(CreateSubscriptionCommand request, CancellationToken cancellationToken)
    {
        var entity = new Subscription
        {
            Name = request.Name,
            Description = request.Description,
            Price = request.Price,
            IsActive = request.IsActive,

            // TODO: Raise an event and handle this in a background
            StripeProductId = _paymentGatewayService.CreateProduct(request.Name, request.Description, request.Price)
        };
        _context.Subscriptions.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);
        return entity.Id;
    }
}
