using GreenRoom.Application.Assets.Queries.GetAssetsByFolderId;
using GreenRoom.Application.Common.Extension;
using GreenRoom.Application.Common.Interfaces;
using GreenRoom.Application.Tags.Queries.GetAllTags;
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
            .Select(x => new FolderDto
            {
                Id = x.Id,
                Name = x.Name,
                Path = x.Path,
                Thumbnail = x.Thumbnail,
                Size = x.Assets != null ? x.Assets.Sum(a => a.Size) : 0,
                AssetCount = x.Assets != null ? x.Assets.Count : 0,
                Tags = x.FolderTags.Select(ft => new TagDto
                {
                    Id = ft.Tag != null ? ft.Tag.Id : 0,
                    Name = ft.Tag != null ? ft.Tag.Name ?? "" : ""
                }).ToArray()
            })
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
    public long Size { get; set; }
    public int AssetCount { get; set; }
    public ICollection<FolderDto>? Children { get; set; }
    public ICollection<AssetDto>? Assets { get; set; }
    public TagDto[] Tags { get; set; } = [];

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Folder, FolderDto>()
                .ForMember(d => d.Tags, opt => opt.MapFrom(s => s.FolderTags.Select(x => x.Tag).ToArray()))
                .ForMember(x => x.AssetCount, opt => opt.MapFrom(x => x.Assets == null ? 0 : x.Assets.Count))
                .ForMember(x => x.Size, opt => opt.MapFrom(x => x.Assets == null ? 0 : x.Assets.Sum(x => x.Size)));
        }
    }
}