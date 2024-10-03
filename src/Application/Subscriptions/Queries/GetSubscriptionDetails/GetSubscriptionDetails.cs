using GreenRoom.Application.Common.Extension;
using GreenRoom.Application.Common.Interfaces;
using GreenRoom.Domain.Entities.DigitalAssetManager;

namespace GreenRoom.Application.Subscriptions.Queries.GetSubscriptionDetails;

public record GetSubscriptionDetailsQuery(int Id) : IRequest<SubscriptionDetailsDto>;

public class GetSubscriptionDetailsQueryValidator : AbstractValidator<GetSubscriptionDetailsQuery>
{
    public GetSubscriptionDetailsQueryValidator(IApplicationDbContext _context)
    {
        RuleFor(v => v.Id)
         .GreaterThan(0)
         .IdMustExistInDatabase(_context.Subscriptions);
    }
}

public class GetSubscriptionDetailsQueryHandler : IRequestHandler<GetSubscriptionDetailsQuery, SubscriptionDetailsDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetSubscriptionDetailsQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public Task<SubscriptionDetailsDto> Handle(GetSubscriptionDetailsQuery request, CancellationToken cancellationToken)
    {
        return _context.Subscriptions
            .ProjectTo<SubscriptionDetailsDto>(_mapper.ConfigurationProvider)
            .FirstAsync(x => x.Id == request.Id);
    }
}

public class SubscriptionDetailsDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public bool IsActive { get; set; }

    private class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Subscription, SubscriptionDetailsDto>();
        }
    }
}
