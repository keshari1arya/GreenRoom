using GreenRoom.Application.Common.Interfaces;
using GreenRoom.Application.Tenants.Queries.GetTenants;

namespace GreenRoom.Application.Tenants.Queries.GetActiveTenants;

public record GetActiveTenantsQuery : IRequest<TenantDto[]>;

public class GetActiveTenantsQueryValidator : AbstractValidator<GetActiveTenantsQuery>
{
    public GetActiveTenantsQueryValidator()
    {
    }
}

public class GetActiveTenantsQueryHandler : IRequestHandler<GetActiveTenantsQuery, TenantDto[]>
{
    private readonly IApplicationDbContext _context;
    private readonly IUser _user;
    private readonly IMapper _mapper;

    public GetActiveTenantsQueryHandler(IApplicationDbContext context, IUser user, IMapper mapper)
    {
        _context = context;
        _user = user;
        _mapper = mapper;
    }

    public async Task<TenantDto[]> Handle(GetActiveTenantsQuery request, CancellationToken cancellationToken)
    {
        var entities = await _context.Tenants
        .Include(x => x.TenantUsers)
            .Where(x => x.IsActive && x.TenantUsers.Any(y => y.UserId == _user.Id))
            .ToArrayAsync(cancellationToken);

        return _mapper.Map<TenantDto[]>(entities);
    }
}
