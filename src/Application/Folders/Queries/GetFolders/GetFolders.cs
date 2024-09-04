using GreenRoom.Application.Assets.Queries.GetAssetsByFolderId;
using GreenRoom.Application.Common.Extension;
using GreenRoom.Application.Common.Interfaces;
using GreenRoom.Domain.Entities.DigitalAssetManager;

namespace GreenRoom.Application.Folders.Queries.GetFolders;

public record GetFoldersQuery(int? FolderId) : IRequest<IEnumerable<FolderDto>>;

public class GetFoldersQueryValidator : AbstractValidator<GetFoldersQuery>
{
    public GetFoldersQueryValidator(IApplicationDbContext context)
    {
        RuleFor(x => x.FolderId)
           .IdMustExistIfNotNull(context.Folders);
    }
}

public class GetFoldersQueryHandler : IRequestHandler<GetFoldersQuery, IEnumerable<FolderDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetFoldersQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<IEnumerable<FolderDto>> Handle(GetFoldersQuery request, CancellationToken cancellationToken)
    {
        var folders = await _context.Folders
            .Where(x => x.ParentId == request.FolderId && !x.IsTrashed)
            .ProjectTo<FolderDto>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
        return folders;
    }
}

public class FolderDto
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public string? Path { get; set; }
    public string? Thumbnail { get; set; }
    public ICollection<FolderDto>? Children { get; set; }
    public ICollection<AssetDto>? Assets { get; set; }

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Folder, FolderDto>();
        }
    }
}