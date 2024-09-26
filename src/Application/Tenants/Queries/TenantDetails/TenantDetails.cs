using GreenRoom.Application.Common.Extension;
using GreenRoom.Application.Common.Interfaces;
using GreenRoom.Application.Tenants.Queries.GetTenants;
using GreenRoom.Domain.Entities.DigitalAssetManager;

namespace GreenRoom.Application.Tenants.Queries.TenantDetails;

public record TenantDetailsQuery(int Id) : IRequest<TenantDto>;

public class TenantDetailsQueryValidator : AbstractValidator<TenantDetailsQuery>
{
    public TenantDetailsQueryValidator(IApplicationDbContext context)
    {
        RuleFor(x => x.Id)
            .IdMustExistInDatabase(context.Tenants);
    }
}

public class TenantDetailsQueryHandler : IRequestHandler<TenantDetailsQuery, TenantDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public TenantDetailsQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<TenantDto> Handle(TenantDetailsQuery request, CancellationToken cancellationToken)
    {
        var entity = await _context.Tenants
            .FindAsync([request.Id], cancellationToken);

        return _mapper.Map<TenantDto>(entity);
    }
}
