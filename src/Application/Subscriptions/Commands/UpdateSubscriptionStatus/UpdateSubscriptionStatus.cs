using GreenRoom.Application.Common.Interfaces;

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

    public UpdateSubscriptionStatusCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(UpdateSubscriptionStatusCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Subscriptions.FindAsync(request.Id);

        Guard.Against.NotFound(request.Id, entity);

        entity.IsActive = request.IsActive;

        await _context.SaveChangesAsync(cancellationToken);
    }
}
