using GreenRoom.Application.Common.Extension;
using GreenRoom.Application.Common.Interfaces;
using GreenRoom.Domain.Entities.DigitalAssetManager;

namespace GreenRoom.Application.Assets.Queries.GetAssetsByFolderId;

public record GetAssetsByFolderIdQuery(int? FolderId) : IRequest<IEnumerable<AssetDto>>;

public class GetAssetsByFolderIdQueryValidator : AbstractValidator<GetAssetsByFolderIdQuery>
{
    public GetAssetsByFolderIdQueryValidator(IApplicationDbContext context)
    {
        RuleFor(x => x.FolderId)
            .IdMustExistIfNotNull(context.Folders);
    }
}

public class GetAssetsByFolderIdQueryHandler : IRequestHandler<GetAssetsByFolderIdQuery, IEnumerable<AssetDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetAssetsByFolderIdQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<IEnumerable<AssetDto>> Handle(GetAssetsByFolderIdQuery request, CancellationToken cancellationToken)
    {
        return await _context.Assets
            .Where(x => x.FolderId == request.FolderId && !x.IsTrashed)
            .ProjectTo<AssetDto>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }
}

public class AssetDto
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public int SizeInKB { get; set; }
    public string? Path { get; set; }
    public string? ContentType { get; set; }
    public DateTimeOffset LastModified { get; set; }

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Asset, AssetDto>();
        }
    }
}

