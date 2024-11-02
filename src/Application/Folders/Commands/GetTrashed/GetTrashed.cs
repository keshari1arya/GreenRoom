using GreenRoom.Application.Common.Interfaces;
using GreenRoom.Domain.Entities.DigitalAssetManager;

namespace GreenRoom.Application.Folders.Commands.GetTrashed;

public record GetTrashedCommand : IRequest<TrashFolderAndFilesDto[]>
{
}

public class GetTrashedCommandValidator : AbstractValidator<GetTrashedCommand>
{
    public GetTrashedCommandValidator()
    {
    }
}

public class GetTrashedCommandHandler : IRequestHandler<GetTrashedCommand, TrashFolderAndFilesDto[]>
{
    private readonly IApplicationDbContext _context;

    public GetTrashedCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<TrashFolderAndFilesDto[]> Handle(GetTrashedCommand request, CancellationToken cancellationToken)
    {
        var folders = await _context.Folders
            .Where(f => f.IsTrashed)
            .ToListAsync(cancellationToken);

        var assets = await _context.Assets
            .Where(a => a.IsTrashed)
            .ToListAsync(cancellationToken);

        var result = new List<TrashFolderAndFilesDto>();

        foreach (var folder in folders)
        {
            result.Add(new TrashFolderAndFilesDto
            {
                Id = folder.Id,
                Name = folder.Name,
                IsFolder = true,
                TrashedAt = folder.LastModified,
                TrashedBy = folder.LastModifiedBy
            });
        }

        foreach (var asset in assets)
        {
            result.Add(new TrashFolderAndFilesDto
            {
                Id = asset.Id,
                Name = asset.Name,
                IsFolder = false,
                TrashedAt = asset.LastModified,
                TrashedBy = asset.LastModifiedBy,
                Size = asset.Size
            });
        }

        return result.ToArray();
    }
}

public class TrashFolderAndFilesDto
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public bool IsFolder { get; set; }
    public DateTimeOffset TrashedAt { get; set; }
    public string? TrashedBy { get; set; }

    /// <summary>
    /// Size of the file in bytes.
    /// </summary>
    public long Size { get; set; }
}