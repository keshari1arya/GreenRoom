using GreenRoom.Application.Common.Extension;
using GreenRoom.Application.Common.Interfaces;
using GreenRoom.Application.Folders.Queries.GetFolderPathToRoot;
using GreenRoom.Application.Interfaces;
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
    private readonly IStorageManagementService _storageManagementService;

    public CreateFolderCommandHandler(IApplicationDbContext context, IStorageManagementService storageManagementService)
    {
        _context = context;
        _storageManagementService = storageManagementService;
    }

    public async Task<int> Handle(CreateFolderCommand request, CancellationToken cancellationToken)
    {
        var path = request.Name;
        if (request.ParentFolderId != null)
        {
            var parentFolder = await _context.Folders.FindAsync([request.ParentFolderId], cancellationToken: cancellationToken);
            path = $"{parentFolder!.Path}/{request.Name}";
        }

        var entity = new Folder
        {
            Name = request.Name,
            ParentId = request.ParentFolderId,
            Thumbnail = request.ThumbnailUrl,
            Path = path
        };

        _context.Folders.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);

        await _storageManagementService.CreateFolderAsync(entity.Path);

        return entity.Id;
    }
}
