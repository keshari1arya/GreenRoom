using GreenRoom.Application.Common.Extension;
using GreenRoom.Application.Common.Interfaces;
using GreenRoom.Application.Common.Models;
using GreenRoom.Domain.Constants;
using Microsoft.AspNetCore.Identity;

namespace GreenRoom.Application.Tenants.Queries.GetUsersForTenant;

public record GetUsersForTenantQuery : IRequest<IEnumerable<TenantUsersDto>>;

public class GetUsersForTenantQueryValidator : AbstractValidator<GetUsersForTenantQuery>
{
    public GetUsersForTenantQueryValidator(IApplicationDbContext context)
    {

    }
}

public class GetUsersForTenantQueryHandler : IRequestHandler<GetUsersForTenantQuery, IEnumerable<TenantUsersDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMultiTenancyService _multiTenancyService;
    private readonly IIdentityService _identityService;
    private readonly UserManager<ApplicationUser> _userManager;

    public GetUsersForTenantQueryHandler(IApplicationDbContext context, IMultiTenancyService multiTenancyService, IIdentityService identityService, UserManager<ApplicationUser> userManager)
    {
        _context = context;
        _multiTenancyService = multiTenancyService;
        _identityService = identityService;
        _userManager = userManager;
    }

    public async Task<IEnumerable<TenantUsersDto>> Handle(GetUsersForTenantQuery request, CancellationToken cancellationToken)
    {
        var tenantUsers = await _context.TenantUsers
             .Where(x => x.TenantId == _multiTenancyService.CurrentTenantId)
             .Select(x => new TenantUsersDto
             {
                 UserId = x.UserId,
                 RoleId = x.TenantRoleId,
             })
             .ToListAsync(cancellationToken);

        var users = _userManager.Users
            .Where(x => tenantUsers.Select(x => x.UserId).Contains(x.Id));

        foreach (var tenantUser in tenantUsers)
        {
            var user = users.FirstOrDefault(x => x.Id == tenantUser.UserId);
            if (user != null)
            {
                tenantUser.UserName = user.UserName;
                tenantUser.Email = user.Email;
                tenantUser.FirstName = user.FirstName;
                tenantUser.LastName = user.LastName;
            }
        }

        return tenantUsers;
    }
}

public class TenantUsersDto
{
    public string UserId { get; set; } = string.Empty;
    public string? UserName { get; set; } = string.Empty;
    public string? Email { get; set; } = string.Empty;
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public int RoleId { get; set; }
}