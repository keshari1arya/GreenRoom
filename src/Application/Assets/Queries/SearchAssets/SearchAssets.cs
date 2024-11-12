using GreenRoom.Application.Assets.Queries.GetAssetsByFolderId;
using GreenRoom.Application.Common.Interfaces;
using GreenRoom.Application.Common.Mappings;
using GreenRoom.Application.Common.Models;

namespace GreenRoom.Application.Assets.Queries.SearchAssets;

public record SearchAssetsQuery : IRequest<PaginatedList<AssetDto>>
{
    public int? ParentFolderId { get; set; }
    public string SearchTerm { get; set; } = string.Empty;
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}

public class SearchAssetsQueryValidator : AbstractValidator<SearchAssetsQuery>
{
    public SearchAssetsQueryValidator()
    {
        RuleFor(x => x.SearchTerm).NotEmpty();
    }
}

public class SearchAssetsQueryHandler : IRequestHandler<SearchAssetsQuery, PaginatedList<AssetDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public SearchAssetsQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PaginatedList<AssetDto>> Handle(SearchAssetsQuery request, CancellationToken cancellationToken)
    {
        return await _context.Assets
            .Where(x =>
                x.FolderId == request.ParentFolderId
                && x.Name!.Contains(request.SearchTerm))
            .ProjectTo<AssetDto>(_mapper.ConfigurationProvider)
            .PaginatedListAsync(request.PageNumber, request.PageSize);
    }
}
