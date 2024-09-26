using GreenRoom.Application.Common.Extension;
using GreenRoom.Application.Common.Interfaces;
using GreenRoom.Domain.Entities.DigitalAssetManager;

namespace GreenRoom.Application.Tenants.Commands.AddTenantSubscription;

public record AddTenantSubscriptionCommand : IRequest<int>
{
    public int SubscriptionId { get; init; }
    public DateTime StartDate { get; init; }
    public DateTime EndDate { get; init; }
}

public class AddTenantSubscriptionCommandValidator : AbstractValidator<AddTenantSubscriptionCommand>
{
    public AddTenantSubscriptionCommandValidator(IApplicationDbContext context)
    {
        RuleFor(v => v.SubscriptionId)
            .IdMustExistInDatabase(context.Subscriptions)
            .NotEmpty();

        RuleFor(v => v.StartDate)
            .NotEmpty();

        RuleFor(v => v.EndDate)
            .NotEmpty();
    }
}

public class AddTenantSubscriptionCommandHandler : IRequestHandler<AddTenantSubscriptionCommand, int>
{
    private readonly IApplicationDbContext _context;

    public AddTenantSubscriptionCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> Handle(AddTenantSubscriptionCommand request, CancellationToken cancellationToken)
    {
        var entity = new TenantSubscription
        {
            SubscriptionId = request.SubscriptionId,
            StartDate = request.StartDate,
            EndDate = request.EndDate
        };

        _context.TenantSubscriptions.Add(entity);

        await _context.SaveChangesAsync(cancellationToken);
        return entity.Id;
    }
}
