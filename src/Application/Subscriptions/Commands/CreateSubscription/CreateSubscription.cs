using GreenRoom.Application.Common.Interfaces;
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

    public CreateSubscriptionCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> Handle(CreateSubscriptionCommand request, CancellationToken cancellationToken)
    {
        var entity = new Subscription
        {
            Name = request.Name,
            Description = request.Description,
            Price = request.Price,
            IsActive = request.IsActive
        };

        _context.Subscriptions.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);
        return entity.Id;
    }
}
