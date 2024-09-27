using GreenRoom.Application.Common.Exceptions;
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
    private readonly IUser _user;

    public TenantDetailsQueryHandler(IApplicationDbContext context, IMapper mapper, IUser user)
    {
        _context = context;
        _mapper = mapper;
        _user = user;
    }

    public async Task<TenantDto> Handle(TenantDetailsQuery request, CancellationToken cancellationToken)
    {
        var isTenantAccessible = _context.TenantUsers
            .Any(x => x.UserId == _user.Id && x.TenantId == request.Id);

        if (!isTenantAccessible)
        {
            throw new ForbiddenAccessException();
        }

        var entity = await _context.Tenants
            .FindAsync([request.Id], cancellationToken);

        return _mapper.Map<TenantDto>(entity);
    }
}
