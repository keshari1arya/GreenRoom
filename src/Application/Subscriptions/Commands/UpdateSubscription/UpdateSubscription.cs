using GreenRoom.Application.Common.Interfaces;
using GreenRoom.Application.Interfaces;
using GreenRoom.Domain.Entities.DigitalAssetManager;

namespace GreenRoom.Application.Subscriptions.Commands.UpdateSubscription;

public record UpdateSubscriptionCommand : IRequest<int>
{
    public int Id { get; set; }
    public string Name { get; init; } = string.Empty;
    public string? Description { get; init; }
    public decimal Price { get; init; }
    public bool IsActive { get; init; }
}

public class UpdateSubscriptionCommandValidator : AbstractValidator<UpdateSubscriptionCommand>
{
    public UpdateSubscriptionCommandValidator()
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

public class UpdateSubscriptionCommandHandler : IRequestHandler<UpdateSubscriptionCommand, int>
{
    private readonly IApplicationDbContext _context;
    private readonly IPaymentGatewayService _paymentGatewayService;

    public UpdateSubscriptionCommandHandler(IApplicationDbContext context, IPaymentGatewayService paymentGatewayService)
    {
        _context = context;
        _paymentGatewayService = paymentGatewayService;
    }

    public async Task<int> Handle(UpdateSubscriptionCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Subscriptions.FindAsync(request.Id);

        Guard.Against.NotFound(request.Id, entity);

        entity.Name = request.Name;
        entity.Description = request.Description;
        entity.Price = request.Price;
        entity.IsActive = request.IsActive;

        // TODO: Raise an event and handle this in a background
        _paymentGatewayService.UpdateProduct(entity.StripeProductId!, request.Name, request.Description, request.Price);


        await _context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}
