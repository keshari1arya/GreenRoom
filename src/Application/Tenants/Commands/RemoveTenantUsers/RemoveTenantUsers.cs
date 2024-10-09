using GreenRoom.Application.Common.Interfaces;
using GreenRoom.Domain.Constants;

namespace GreenRoom.Application.Tenants.Commands.RemoveTenantUsers;

public record RemoveTenantUsersCommand(string[] UserIds) : IRequest<int>;

public class RemoveTenantUsersCommandValidator : AbstractValidator<RemoveTenantUsersCommand>
{
    public RemoveTenantUsersCommandValidator()
    {
        RuleFor(v => v.UserIds)
            .NotEmpty();

        // TODO: validate that the user ids exists in the database
    }
}

public class RemoveTenantUsersCommandHandler : IRequestHandler<RemoveTenantUsersCommand, int>
{
    private readonly IApplicationDbContext _context;
    private readonly IMultiTenancyService _multiTenancyService;
    private readonly IUser _user;

    public RemoveTenantUsersCommandHandler(IApplicationDbContext context, IMultiTenancyService multiTenancyService, IUser user)
    {
        _context = context;
        _multiTenancyService = multiTenancyService;
        _user = user;
    }

    public async Task<int> Handle(RemoveTenantUsersCommand request, CancellationToken cancellationToken)
    {
        var tenantUser = _context.TenantUsers
        .Include(x => x.TenantRole)
        .AsNoTracking()
        .FirstOrDefault(x => x.UserId == _user.Id && x.TenantId == _multiTenancyService.CurrentTenantId && x.TenantRole.RoleName == Roles.Administrator);

        Guard.Against.Null(tenantUser, nameof(tenantUser), "You are not authorized to perform this action.");

        var tenantUsers = _context.TenantUsers
            .Where(x => request.UserIds.Contains(x.UserId) && x.TenantId == _multiTenancyService.CurrentTenantId);

        _context.TenantUsers.RemoveRange(tenantUsers);

        return await _context.SaveChangesAsync(cancellationToken);
    }
}
