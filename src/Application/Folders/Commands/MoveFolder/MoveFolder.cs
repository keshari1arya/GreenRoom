using GreenRoom.Application.Common.Extension;
using GreenRoom.Application.Common.Interfaces;
using GreenRoom.Domain.Entities.DigitalAssetManager;

namespace GreenRoom.Application.Folders.Commands.MoveFolders;

public record MoveFoldersCommand(
    int[] Ids,
    int DestinationFolderId
) : IRequest;

public class MoveFoldersCommandValidator : AbstractValidator<MoveFoldersCommand>
{
    public MoveFoldersCommandValidator(IApplicationDbContext context)
    {
        RuleFor(v => v.Ids)
            .NotEmpty()
            .IdsMustExistInDatabase(context.Folders);

        RuleFor(v => v.DestinationFolderId)
            .NotEmpty()
            .IdMustExistInDatabase(context.Folders);
    }
}

public class MoveFoldersCommandHandler : IRequestHandler<MoveFoldersCommand>
{
    private readonly IApplicationDbContext _context;

    public MoveFoldersCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(MoveFoldersCommand request, CancellationToken cancellationToken)
    {
        var entities = _context.Folders
            .Where(x => request.Ids.Contains(x.Id));
        await entities.ForEachAsync(x => x.ParentId = request.DestinationFolderId);
        await _context.SaveChangesAsync(cancellationToken);
    }
}

