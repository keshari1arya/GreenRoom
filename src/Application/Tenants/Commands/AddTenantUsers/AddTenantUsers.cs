using GreenRoom.Application.Common.Extension;
using GreenRoom.Application.Common.Interfaces;
using GreenRoom.Domain.Constants;
using GreenRoom.Domain.Entities.DigitalAssetManager;
using Microsoft.AspNetCore.Identity;

namespace GreenRoom.Application.Tenants.Commands.AddTenantUsers;

public record AddTenantUsersCommand(AddTenantUserDto[] UsersWithRole) : IRequest<int>;

public class AddTenantUsersCommandValidator : AbstractValidator<AddTenantUsersCommand>
{
    public AddTenantUsersCommandValidator(IApplicationDbContext context, IMultiTenancyService multiTenancyService)
    {
        RuleFor(v => v.UsersWithRole)
        .Must(users => context.TenantRoles.Any(x => users.Select(x => x.RoleId).Contains(x.Id)))
        .WithMessage("Role does not exist.")
        .Must(users => users.Select(x => x.UserId).Distinct().Count() == users.Length)
        .WithMessage("Duplicate user found.")
        .Must(users => !context.TenantUsers.Any(x => users.Select(x => x.UserId).Contains(x.UserId) && x.TenantId == multiTenancyService.CurrentTenantId))
        .WithMessage("User already exists in the tenant.")
        .NotEmpty();
    }
}

public class AddTenantUsersCommandHandler : IRequestHandler<AddTenantUsersCommand, int>
{
    private readonly IApplicationDbContext _context;
    private readonly IMultiTenancyService _multiTenancyService;
    private readonly IUser _user;

    public AddTenantUsersCommandHandler(IApplicationDbContext context, IMultiTenancyService multiTenancyService, IUser user)
    {
        _context = context;
        _multiTenancyService = multiTenancyService;
        _user = user;
    }

    public async Task<int> Handle(AddTenantUsersCommand request, CancellationToken cancellationToken)
    {
        var tenantUser = _context.TenantUsers
        .Include(x => x.TenantRole)
        .AsNoTracking()
        .FirstOrDefault(x => x.UserId == _user.Id && x.TenantId == _multiTenancyService.CurrentTenantId && x.TenantRole.RoleName == Roles.Administrator);

        Guard.Against.Null(tenantUser, nameof(tenantUser), "You are not authorized to perform this action.");

        foreach (var record in request.UsersWithRole)
        {
            _context.TenantUsers.Add(new TenantUser
            {
                TenantId = _multiTenancyService.CurrentTenantId,
                UserId = record.UserId,
                TenantRoleId = record.RoleId
            });
        }

        return await _context.SaveChangesAsync(cancellationToken);
    }
}

public class AddTenantUserDto
{
    public string UserId { get; set; } = string.Empty;
    public int RoleId { get; set; }
}