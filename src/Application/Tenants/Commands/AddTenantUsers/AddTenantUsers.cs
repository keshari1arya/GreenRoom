using GreenRoom.Application.Common.Extension;
using GreenRoom.Application.Common.Interfaces;
using GreenRoom.Domain.Constants;
using GreenRoom.Domain.Entities.DigitalAssetManager;
using Microsoft.AspNetCore.Identity;

namespace GreenRoom.Application.Tenants.Commands.AddTenantUsers;

public record AddTenantUsersCommand(AddTenantUserDto[] UsersWithRole) : IRequest<int>;

public class AddTenantUsersCommandValidator : AbstractValidator<AddTenantUsersCommand>
{
    public AddTenantUsersCommandValidator(IApplicationDbContext context)
    {
        RuleFor(v => v.UsersWithRole)
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
        .FirstOrDefault(x => x.UserId == _user.Id && x.TenantId == _multiTenancyService.CurrentTenant && x.TenantRole.RoleName == Roles.Administrator);

        Guard.Against.Null(tenantUser, nameof(tenantUser), "You are not authorized to perform this action.");

        foreach (var record in request.UsersWithRole)
        {
            _context.TenantUsers.Add(new TenantUser
            {
                TenantId = _multiTenancyService.CurrentTenant,
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