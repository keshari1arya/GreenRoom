using GreenRoom.Application.Common.Extension;
using GreenRoom.Application.Common.Interfaces;

namespace GreenRoom.Application.Folders.Commands.TrashFolders;

public record TrashFoldersCommand(int[] ids) : IRequest;

public class TrashFoldersCommandValidator : AbstractValidator<TrashFoldersCommand>
{
    public TrashFoldersCommandValidator(IApplicationDbContext context)
    {
        RuleFor(x => x.ids)
            .NotEmpty()
            .IdsMustExistInDatabase(context.Folders);
    }
}

public class TrashFoldersCommandHandler : IRequestHandler<TrashFoldersCommand>
{
    private readonly IApplicationDbContext _context;

    public TrashFoldersCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(TrashFoldersCommand request, CancellationToken cancellationToken)
    {
        var entities = _context.Folders
            .Where(x => request.ids.Contains(x.Id));
        await entities.ForEachAsync(x => x.IsTrashed = true);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
