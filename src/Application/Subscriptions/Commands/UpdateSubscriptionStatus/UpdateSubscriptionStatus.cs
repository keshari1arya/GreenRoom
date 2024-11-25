using GreenRoom.Application.Common.Interfaces;
using GreenRoom.Application.Interfaces;

namespace GreenRoom.Application.Subscriptions.Commands.UpdateSubscriptionStatus;

public record UpdateSubscriptionStatusCommand(
    int Id,
    bool IsActive
) : IRequest;

public class UpdateSubscriptionStatusCommandValidator : AbstractValidator<UpdateSubscriptionStatusCommand>
{
    public UpdateSubscriptionStatusCommandValidator()
    {
    }
}

public class UpdateSubscriptionStatusCommandHandler : IRequestHandler<UpdateSubscriptionStatusCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly IPaymentGatewayService _paymentGatewayService;

    public UpdateSubscriptionStatusCommandHandler(IApplicationDbContext context, IPaymentGatewayService paymentGatewayService)
    {
        _context = context;
        _paymentGatewayService = paymentGatewayService;
    }

    public async Task Handle(UpdateSubscriptionStatusCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Subscriptions.FindAsync(request.Id, cancellationToken);

        Guard.Against.NotFound(request.Id, entity);

        entity.IsActive = request.IsActive;

        // TODO: Raise an event and handle this in a background
        if (request.IsActive)
        {
            entity.StripeProductId = _paymentGatewayService.CreateProduct(entity.Name, entity.Description, entity.Price);
        }
        else
        {
            _paymentGatewayService.DeleteProduct(entity.StripeProductId!);
        }

        await _context.SaveChangesAsync(cancellationToken);
    }
}
