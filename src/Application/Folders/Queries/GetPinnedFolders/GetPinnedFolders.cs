using GreenRoom.Application.Common.Interfaces;
using GreenRoom.Application.Folders.Queries.GetFolders;

namespace GreenRoom.Application.Folders.Queries.GetPinnedFolders;

public record GetPinnedFoldersQuery : IRequest<IEnumerable<FolderDto>>;

public class GetPinnedFoldersQueryValidator : AbstractValidator<GetPinnedFoldersQuery>
{
    public GetPinnedFoldersQueryValidator()
    {
    }
}

public class GetPinnedFoldersQueryHandler : IRequestHandler<GetPinnedFoldersQuery, IEnumerable<FolderDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IUser _user;
    private readonly IMapper _mapper;

    public GetPinnedFoldersQueryHandler(IApplicationDbContext context, IUser user, IMapper mapper)
    {
        _context = context;
        _user = user;
        _mapper = mapper;
    }

    public async Task<IEnumerable<FolderDto>> Handle(GetPinnedFoldersQuery request, CancellationToken cancellationToken)
    {
        var folders = await _context.FolderPins
            .Where(x => x.UserId == _user.Id)
            .Include(x => x.Folder)
            .Select(x => x.Folder)
            .ToListAsync(cancellationToken);

        return _mapper.Map<IEnumerable<FolderDto>>(folders);
    }
}
