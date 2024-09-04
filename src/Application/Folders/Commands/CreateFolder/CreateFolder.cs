using GreenRoom.Application.Common.Extension;
using GreenRoom.Application.Common.Interfaces;
using GreenRoom.Domain.Entities.DigitalAssetManager;

namespace GreenRoom.Application.Folders.Commands.CreateFolder;

public record CreateFolderCommand(
    string Name,
    int? ParentFolderId,
    string? ThumbnailUrl,
    string? Path
) : IRequest<int>;

public class CreateFolderCommandValidator : AbstractValidator<CreateFolderCommand>
{
    public CreateFolderCommandValidator(IApplicationDbContext context)
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .MaximumLength(256);

        RuleFor(x => x.ParentFolderId)
            .IdMustExistIfNotNull(context.Folders);
    }
}

public class CreateFolderCommandHandler : IRequestHandler<CreateFolderCommand, int>
{
    private readonly IApplicationDbContext _context;

    public CreateFolderCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> Handle(CreateFolderCommand request, CancellationToken cancellationToken)
    {
        var entity = new Folder
        {
            Name = request.Name,
            ParentId = request.ParentFolderId,
            Thumbnail = request.ThumbnailUrl,
            Path = request.Path ?? "/", // TODO: Implement path generation
        };

        _context.Folders.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);
        return entity.Id;
    }
}
