using GreenRoom.Application.Assets.Queries.GetAssetsByFolderId;
using GreenRoom.Application.Common.Interfaces;

namespace GreenRoom.Application.Assets.Queries.SearchAssets;

public record SearchAssetsQuery : IRequest<IEnumerable<AssetDto>>
{
    public int? ParentFolderId { get; set; }
    public string SearchTerm { get; set; } = string.Empty;
}

public class SearchAssetsQueryValidator : AbstractValidator<SearchAssetsQuery>
{
    public SearchAssetsQueryValidator()
    {
        RuleFor(x => x.SearchTerm).NotEmpty();
    }
}

public class SearchAssetsQueryHandler : IRequestHandler<SearchAssetsQuery, IEnumerable<AssetDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public SearchAssetsQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<IEnumerable<AssetDto>> Handle(SearchAssetsQuery request, CancellationToken cancellationToken)
    {
        return await _context.Assets
            .Where(x =>
                x.FolderId == request.ParentFolderId
                && x.Name!.Contains(request.SearchTerm))
            .ProjectTo<AssetDto>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }
}
