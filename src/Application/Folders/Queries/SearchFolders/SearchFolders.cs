using GreenRoom.Application.Common.Interfaces;
using GreenRoom.Application.Folders.Queries.GetFolders;

namespace GreenRoom.Application.Folders.Queries.SearchFolders;

public record SearchFoldersQuery : IRequest<IEnumerable<FolderDto>>
{
    public int? ParentFolderId { get; set; }
    public string SearchTerm { get; set; } = string.Empty;
}

public class SearchFoldersQueryValidator : AbstractValidator<SearchFoldersQuery>
{
    public SearchFoldersQueryValidator()
    {
        RuleFor(x => x.SearchTerm).NotEmpty();
    }
}

public class SearchFoldersQueryHandler : IRequestHandler<SearchFoldersQuery, IEnumerable<FolderDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public SearchFoldersQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<IEnumerable<FolderDto>> Handle(SearchFoldersQuery request, CancellationToken cancellationToken)
    {
        return await _context.Folders
            .Where(x =>
            x.ParentId == request.ParentFolderId
            && x.Name!.Contains(request.SearchTerm))
            .ProjectTo<FolderDto>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }
}
