using GreenRoom.Application.Common.Extension;
using GreenRoom.Application.Common.Interfaces;

namespace GreenRoom.Application.Folders.Commands.RestoreFolders;

public record RestoreFoldersCommand(int[] Ids) : IRequest;

public class RestoreFoldersCommandValidator : AbstractValidator<RestoreFoldersCommand>
{
    public RestoreFoldersCommandValidator(IApplicationDbContext context)
    {
        RuleFor(x => x.Ids)
            .NotEmpty()
            .IdsMustExistInDatabase(context.Folders);
    }
}

public class RestoreFoldersCommandHandler : IRequestHandler<RestoreFoldersCommand>
{
    private readonly IApplicationDbContext _context;

    public RestoreFoldersCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(RestoreFoldersCommand request, CancellationToken cancellationToken)
    {
        var entities = _context.Folders
            .Where(x => request.Ids.Contains(x.Id));
        await entities.ForEachAsync(x => x.IsTrashed = false);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
