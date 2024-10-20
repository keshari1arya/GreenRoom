﻿using GreenRoom.Application.Common.Interfaces;

namespace GreenRoom.Application.Tenants.Commands.UpdateTenant;

public record UpdateTenantCommand : IRequest<Guid>
{
    public Guid Id { get; set; }
    public string Name { get; init; } = string.Empty;
    public string? Description { get; init; }
}

public class UpdateTenantCommandValidator : AbstractValidator<UpdateTenantCommand>
{
    public UpdateTenantCommandValidator(IApplicationDbContext context)
    {
        RuleFor(v => v.Name)
            .MaximumLength(200)
            .NotEmpty();

        RuleFor(v => v.Description)
            .MaximumLength(200);

        RuleFor(v => v.Id)
            .NotEmpty();
    }
}

public class UpdateTenantCommandHandler : IRequestHandler<UpdateTenantCommand, Guid>
{
    private readonly IApplicationDbContext _context;

    public UpdateTenantCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(UpdateTenantCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Tenants
            .FindAsync([request.Id], cancellationToken);

        Guard.Against.NotFound(request.Id, entity);

        entity.Name = request.Name;
        entity.Description = request.Description;

        await _context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}
