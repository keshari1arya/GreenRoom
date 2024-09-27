using GreenRoom.Application.Common.Interfaces;
using GreenRoom.Application.Tenants.Queries.GetTenants;
using GreenRoom.Application.Tenants.Queries.TenantDetails;
using GreenRoom.Domain.Entities.DigitalAssetManager;

namespace GreenRoom.Application.Tenants.Queries.GetCurrentTenant;

public record GetCurrentTenantQuery : IRequest<TenantDetailsDto>
{
}

public class GetCurrentTenantQueryValidator : AbstractValidator<GetCurrentTenantQuery>
{
    public GetCurrentTenantQueryValidator()
    {
    }
}

public class GetCurrentTenantQueryHandler : IRequestHandler<GetCurrentTenantQuery, TenantDetailsDto>
{
    private readonly ISender _sender;
    private readonly IMultiTenancyService _multiTenancyService;
    private readonly IApplicationDbContext _context;

    private readonly IMapper _mapper;

    public GetCurrentTenantQueryHandler(ISender sender, IMultiTenancyService multiTenancyService, IApplicationDbContext context, IMapper mapper)
    {
        _sender = sender;
        _multiTenancyService = multiTenancyService;
        _context = context;
        _mapper = mapper;
    }

    public async Task<TenantDetailsDto> Handle(GetCurrentTenantQuery request, CancellationToken cancellationToken)
    {
        var tenantId = _multiTenancyService.CurrentTenant;
        var tenantDto = await _context.Tenants
            .Include(x => x.TenantSubscriptions)
            .ThenInclude(x => x.Subscription)
            .Where(x => x.Id == tenantId)
            .ProjectTo<TenantDetailsDto>(_mapper.ConfigurationProvider)
            .FirstAsync(cancellationToken: cancellationToken);

        return tenantDto;
    }
}

public class TenantDetailsDto : TenantDto
{
    public SubscriptionDetailsDto Subscription { get; set; } = new();
}

public class SubscriptionDetailsDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Tenant, TenantDetailsDto>()
            .ForMember(d => d.Subscription, opt => opt.MapFrom(s => GetLatestSubscription(s)));

            CreateMap<TenantSubscription, SubscriptionDetailsDto>()
                .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Subscription != null ? s.Subscription.Id : 0))
                .ForMember(d => d.Name, opt => opt.MapFrom(s => s.Subscription != null ? s.Subscription.Name : string.Empty))
                .ForMember(d => d.StartDate, opt => opt.MapFrom(s => s.StartDate))
                .ForMember(d => d.EndDate, opt => opt.MapFrom(s => s.EndDate));
        }

        private static TenantSubscription? GetLatestSubscription(Tenant tenant)
        {
            var latest = tenant.TenantSubscriptions
                .Where(x => x.StartDate <= DateTime.Now && x.EndDate >= DateTime.Now)
                .OrderByDescending(x => x.StartDate)
                .FirstOrDefault();

            // If there is no active subscription, return the latest subscription
            return latest ?? tenant.TenantSubscriptions
                .OrderByDescending(x => x.StartDate)
                .FirstOrDefault();
        }
    }
}
