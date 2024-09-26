using GreenRoom.Application.Common.Extension;
using GreenRoom.Application.Common.Interfaces;
using GreenRoom.Domain.Entities.DigitalAssetManager;

namespace GreenRoom.Application.Tenants.Commands.CreateTenant;

public record CreateTenantCommand(
    string Name,
    string? Description
) : IRequest<int>;

public class CreateTenantCommandValidator : AbstractValidator<CreateTenantCommand>
{
    public CreateTenantCommandValidator(IApplicationDbContext context)
    {
        RuleFor(v => v.Name)
            .MaximumLength(200)

           // TODO: Make a generic method for this validation in ValidationExtensions
           .MustAsync(async (name, cancellationToken) =>
              {
                  return !await context.Tenants.AsNoTracking().AnyAsync(x => x.Name == name, cancellationToken);
              })
              .WithMessage("{PropertyName}: {PropertyValue} already exists.")
            .NotEmpty();

        RuleFor(v => v.Description)
            .MaximumLength(200);
    }
}

public class CreateTenantCommandHandler : IRequestHandler<CreateTenantCommand, int>
{
    private readonly IApplicationDbContext _context;
    private readonly IUser _user;

    public CreateTenantCommandHandler(IApplicationDbContext context, IUser user)
    {
        _context = context;
        _user = user;
    }

    public async Task<int> Handle(CreateTenantCommand request, CancellationToken cancellationToken)
    {
        var entity = new Tenant
        {
            Name = request.Name,
            Description = request.Description,
            IsActive = true,
            TenantUsers = [
                new() {
                    UserId = _user.Id!,
                    TenantRoleId = 1
                }
            ]
        };

        _context.Tenants.Add(entity);

        await _context.SaveChangesAsync(cancellationToken);
        return entity.Id;
    }
}
