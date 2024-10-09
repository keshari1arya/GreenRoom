using GreenRoom.Application.Common.Extension;
using GreenRoom.Application.Common.Interfaces;
using GreenRoom.Domain.Constants;

namespace GreenRoom.Application.Tenants.Commands.UpdateRole;

public record UpdateRoleCommand(string UserId, int RoleId) : IRequest<int>;

public class UpdateRoleCommandValidator : AbstractValidator<UpdateRoleCommand>
{
    public UpdateRoleCommandValidator(IApplicationDbContext context)
    {
        RuleFor(v => v.UserId)
            .NotEmpty();

        RuleFor(v => v.RoleId)
            .NotEmpty()
            .IdMustExistInDatabase(context.TenantRoles);
    }
}

public class UpdateRoleCommandHandler : IRequestHandler<UpdateRoleCommand, int>
{
    private readonly IApplicationDbContext _context;
    private readonly IMultiTenancyService _multiTenancyService;
    private readonly IUser _user;

    public UpdateRoleCommandHandler(IApplicationDbContext context, IMultiTenancyService multiTenancyService, IUser user)
    {
        _context = context;
        _multiTenancyService = multiTenancyService;
        _user = user;
    }

    public async Task<int> Handle(UpdateRoleCommand request, CancellationToken cancellationToken)
    {
        var tenantUser = _context.TenantUsers
            .Include(x => x.TenantRole)
            .AsNoTracking()
            .FirstOrDefault(x => x.UserId == _user.Id && x.TenantId == _multiTenancyService.CurrentTenantId && x.TenantRole.RoleName == Roles.Administrator);

        Guard.Against.Null(tenantUser, nameof(tenantUser), "You are not authorized to perform this action.");

        var user = _context.TenantUsers
            .Include(x => x.TenantRole)
            .FirstOrDefault(x => x.UserId == request.UserId && x.TenantId == _multiTenancyService.CurrentTenantId);

        Guard.Against.Null(user, nameof(user), "User not found.");

        user.TenantRoleId = request.RoleId;

        return await _context.SaveChangesAsync(cancellationToken);
    }
}
