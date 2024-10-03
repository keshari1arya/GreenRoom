using GreenRoom.Application.Common.Extension;
using GreenRoom.Application.Common.Interfaces;
using GreenRoom.Domain.Entities.DigitalAssetManager;

namespace GreenRoom.Application.Assets.Queries.GetAssetDetails;

public record GetAssetDetailsQuery(int Id) : IRequest<AssetDetailsDto>;

public class GetAssetDetailsQueryValidator : AbstractValidator<GetAssetDetailsQuery>
{
    public GetAssetDetailsQueryValidator(IApplicationDbContext context)
    {
        RuleFor(v => v.Id)
        .GreaterThan(0)
        .IdMustExistInDatabase(context.Assets);
    }
}

public class GetAssetDetailsQueryHandler : IRequestHandler<GetAssetDetailsQuery, AssetDetailsDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetAssetDetailsQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<AssetDetailsDto> Handle(GetAssetDetailsQuery request, CancellationToken cancellationToken)
    {
        var asset = await _context.Assets
            .Include(a => a.AssetTags)
            .ThenInclude(at => at.Tag)
            .FirstOrDefaultAsync(a => a.Id == request.Id, cancellationToken);

        return _mapper.Map<AssetDetailsDto>(asset);
    }
}

public class AssetDetailsDto
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Path { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public string SizeInKB { get; set; } = string.Empty;
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
    public DateTimeOffset DeletedAt { get; set; }
    public string Thumbnail { get; set; } = string.Empty;
    public string Preview { get; set; } = string.Empty;
    public string Download { get; set; } = string.Empty;
    public string Share { get; set; } = string.Empty;
    public string[] Tags { get; set; } = Array.Empty<string>();

    private class AssetDetailsDtoProfile : Profile
    {
        public AssetDetailsDtoProfile()
        {
            CreateMap<Asset, AssetDetailsDto>()
                .ForMember(d => d.CreatedAt, opt => opt.MapFrom(s => s.Created))
                .ForMember(d => d.UpdatedAt, opt => opt.MapFrom(s => s.LastModified))
                .ForMember(d => d.Tags, opt => opt.MapFrom(s => s.AssetTags.Select(t => t.Tag!.Name).ToArray()));
        }
    }
}
