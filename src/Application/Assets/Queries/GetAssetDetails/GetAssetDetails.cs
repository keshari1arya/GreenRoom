using GreenRoom.Application.Common.Extension;
using GreenRoom.Application.Common.Interfaces;
using GreenRoom.Application.Interfaces;
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
    private readonly IStorageManagementService _storageManagementService;

    public GetAssetDetailsQueryHandler(IApplicationDbContext context, IMapper mapper, IStorageManagementService storageManagementService)
    {
        _context = context;
        _mapper = mapper;
        _storageManagementService = storageManagementService;
    }

    public async Task<AssetDetailsDto> Handle(GetAssetDetailsQuery request, CancellationToken cancellationToken)
    {
        var asset = await _context.Assets
            .Include(a => a.Folder)
            .Include(a => a.AssetTags)
            .ThenInclude(at => at.Tag)
            .AsNoTracking()
            .FirstOrDefaultAsync(a => a.Id == request.Id, cancellationToken);

        var mappedAsset = _mapper.Map<AssetDetailsDto>(asset);
        var expiryInSeconds = Math.Abs(int.Parse(mappedAsset!.SizeInKB) / 1000);
        var path = asset!.Name;
        if (asset.FolderId != null)
        {
            path = $"{asset.Folder!.Path}/{asset.Name}";
        }

        mappedAsset.Path = _storageManagementService.GenerateUrlToDownload(path!, expiryInSeconds);
        return mappedAsset;
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
    public string[] Tags { get; set; } = [];
    public int? FolderId { get; set; }

    private class AssetDetailsDtoProfile : Profile
    {
        public AssetDetailsDtoProfile()
        {
            CreateMap<Asset, AssetDetailsDto>()
                .ForMember(d => d.FolderId, opt => opt.MapFrom(s => s.FolderId))
                .ForMember(d => d.CreatedAt, opt => opt.MapFrom(s => s.Created))
                .ForMember(d => d.UpdatedAt, opt => opt.MapFrom(s => s.LastModified))
                .ForMember(d => d.Tags, opt => opt.MapFrom(s => s.AssetTags.Select(t => t.Tag!.Name).ToArray()))

                .ForMember(d => d.Description, opt => opt.Ignore())
                .ForMember(d => d.Thumbnail, opt => opt.Ignore())
                .ForMember(d => d.Preview, opt => opt.Ignore())
                .ForMember(d => d.Download, opt => opt.Ignore())
                .ForMember(d => d.Share, opt => opt.Ignore())
                .ForMember(d => d.DeletedAt, opt => opt.Ignore());

        }
    }
}
