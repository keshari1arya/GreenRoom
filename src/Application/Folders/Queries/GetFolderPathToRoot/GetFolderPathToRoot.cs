using GreenRoom.Application.Common.Interfaces;
using GreenRoom.Application.Common.Extension;

namespace GreenRoom.Application.Folders.Queries.GetFolderPathToRoot;

public record GetFolderPathToRootQuery(int? FolderId) : IRequest<IEnumerable<PathToRootDto>>;

public class GetFolderPathToRootQueryValidator : AbstractValidator<GetFolderPathToRootQuery>
{
    public GetFolderPathToRootQueryValidator(IApplicationDbContext context)
    {
        RuleFor(x => x.FolderId)
           .IdMustExistIfNotNull(context.Folders);
    }
}

public class GetFolderPathToRootQueryHandler : IRequestHandler<GetFolderPathToRootQuery, IEnumerable<PathToRootDto>>
{
    private readonly IApplicationDbContext _context;

    public GetFolderPathToRootQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<PathToRootDto>> Handle(GetFolderPathToRootQuery request, CancellationToken cancellationToken)
    {

        var breadcrumbPath = new List<PathToRootDto>();
        var currentFolder = await _context.Folders.FindAsync(request.FolderId);

        while (currentFolder != null)
        {
            breadcrumbPath.Add(new PathToRootDto
            {
                FolderId = currentFolder.Id,
                FolderName = currentFolder.Name
            });
            currentFolder = currentFolder.ParentId.HasValue ? await _context.Folders.FindAsync(currentFolder.ParentId.Value) : null;
        }

        breadcrumbPath.Reverse();
        return breadcrumbPath;
    }
}

public class PathToRootDto
{
    public int FolderId { get; set; }
    public string? FolderName { get; set; }
}