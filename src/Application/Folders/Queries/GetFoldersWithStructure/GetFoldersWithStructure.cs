using GreenRoom.Application.Common.Interfaces;
using GreenRoom.Application.Folders.Queries.GetFolders;
using GreenRoom.Domain.Entities.DigitalAssetManager;

namespace GreenRoom.Application.Folders.Queries.GetFoldersWithStructure;

public record GetFoldersWithStructureQuery : IRequest<List<FolderDto>>
{
}

public class GetFoldersWithStructureQueryValidator : AbstractValidator<GetFoldersWithStructureQuery>
{
    public GetFoldersWithStructureQueryValidator()
    {
    }
}

public class GetFoldersWithStructureQueryHandler : IRequestHandler<GetFoldersWithStructureQuery, List<FolderDto>>
{
    private readonly IApplicationDbContext _context;

    public GetFoldersWithStructureQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<FolderDto>> Handle(GetFoldersWithStructureQuery request, CancellationToken cancellationToken)
    {
        var folders = await _context.Folders
            .Where(x => x.IsTrashed == false)
            .ToListAsync(cancellationToken);

        var folderTree = BuildFolderTree(folders, null);

        return folderTree;
    }

    private List<FolderDto> BuildFolderTree(List<Folder> folders, int? parentId)
    {
        return folders
            .Where(f => f.ParentId == parentId)
            .Select(f => new FolderDto
            {
                Id = f.Id,
                Name = f.Name,
                Children = BuildFolderTree(folders, f.Id)
            })
            .ToList();
    }

}
