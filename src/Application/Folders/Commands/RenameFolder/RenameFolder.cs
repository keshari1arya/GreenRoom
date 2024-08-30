using GreenRoom.Application.Common.Extension;
using GreenRoom.Application.Common.Interfaces;

namespace GreenRoom.Application.Folders.Commands.RenameFolder;

public record RenameFolderCommand(
    int Id,
    string Name
) : IRequest;

public class RenameFolderCommandValidator : AbstractValidator<RenameFolderCommand>
{
    public RenameFolderCommandValidator(IApplicationDbContext context)
    {
        RuleFor(x => x.Id)
           .IdMustExistInDatabase(context.Folders);

        RuleFor(x => x.Name)
            .NotEmpty()
            .MaximumLength(256);
    }
}

public class RenameFolderCommandHandler : IRequestHandler<RenameFolderCommand>
{
    private readonly IApplicationDbContext _context;

    public RenameFolderCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(RenameFolderCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Folders
            .FindAsync([request.Id], cancellationToken);

        entity!.Name = request.Name;
        await _context.SaveChangesAsync(cancellationToken);
    }
}
