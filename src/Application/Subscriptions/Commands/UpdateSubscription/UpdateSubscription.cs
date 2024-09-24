﻿using GreenRoom.Application.Common.Interfaces;
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

    public UpdateSubscriptionCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> Handle(UpdateSubscriptionCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Subscriptions.FindAsync(request.Id);

        Guard.Against.NotFound(request.Id, entity);

        entity.Name = request.Name;
        entity.Description = request.Description;
        entity.Price = request.Price;
        entity.IsActive = request.IsActive;

        await _context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}