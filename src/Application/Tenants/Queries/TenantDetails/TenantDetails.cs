using GreenRoom.Application.Common.Interfaces;
using GreenRoom.Application.Tenants.Queries.GetTenants;

namespace GreenRoom.Application.Tenants.Queries.TenantDetails;

public record TenantDetailsQuery(int Id) : IRequest<IEnumerable<TenantDto>>;

public class TenantDetailsQueryValidator : AbstractValidator<TenantDetailsQuery>
{
    public TenantDetailsQueryValidator()
    {
    }
}

public class TenantDetailsQueryHandler : IRequestHandler<TenantDetailsQuery, IEnumerable<TenantDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public TenantDetailsQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<IEnumerable<TenantDto>> Handle(TenantDetailsQuery request, CancellationToken cancellationToken)
    {
        return await _context.Tenants
            .ProjectTo<TenantDto>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }
}
