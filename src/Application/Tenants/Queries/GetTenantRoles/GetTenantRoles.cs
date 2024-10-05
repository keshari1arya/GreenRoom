using GreenRoom.Application.Common.Interfaces;
using GreenRoom.Domain.Constants;

namespace GreenRoom.Application.Tenants.Queries.GetTenantRoles;

public record GetTenantRolesQuery : IRequest<TenantRolesDto[]>
{
}

public class GetTenantRolesQueryValidator : AbstractValidator<GetTenantRolesQuery>
{
    public GetTenantRolesQueryValidator()
    {
    }
}

public class GetTenantRolesQueryHandler : IRequestHandler<GetTenantRolesQuery, TenantRolesDto[]>
{
    private readonly IMultiTenancyService _multiTenancyService;
    private readonly IApplicationDbContext _context;

    public GetTenantRolesQueryHandler(IMultiTenancyService multiTenancyService, IApplicationDbContext context)
    {
        _multiTenancyService = multiTenancyService;
        _context = context;
    }

    public Task<TenantRolesDto[]> Handle(GetTenantRolesQuery request, CancellationToken cancellationToken)
    {
        Guard.Against.Null(_multiTenancyService.CurrentTenant, nameof(_multiTenancyService.CurrentTenant));

        // TODO: Only return roles that are available to the current tenant

        var tenantRoles = _context.TenantRoles
            .Select(x => new TenantRolesDto
            {
                Id = x.Id,
                Name = x.RoleName,
                Description = x.Description
            })
            .ToArray();

        return Task.FromResult(tenantRoles);
    }
}

public class TenantRolesDto
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string Description { get; set; } = null!;
}
