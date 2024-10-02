using GreenRoom.Application.Common.Extension;
using GreenRoom.Application.Common.Interfaces;

namespace GreenRoom.Application.Tags.Commands.DetachTag;

public record DetachTagCommand(int TagId, int? AssetId, int? FolderId) : IRequest;

public class DetachTagCommandValidator : AbstractValidator<DetachTagCommand>
{
    public DetachTagCommandValidator(IApplicationDbContext _context)
    {
        RuleFor(v => v.TagId)
               .GreaterThan(0)
               .IdMustExistInDatabase(_context.Tags);

        RuleFor(v => v.AssetId)
        .IdMustExistIfNotNull(_context.Assets)
        .When(v => v.FolderId != null);

        RuleFor(v => v.FolderId)
        .IdMustExistIfNotNull(_context.Folders)
        .When(v => v.AssetId != null);
    }
}

public class DetachTagCommandHandler : IRequestHandler<DetachTagCommand>
{
    private readonly IApplicationDbContext _context;

    public DetachTagCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(DetachTagCommand request, CancellationToken cancellationToken)
    {

        if (request.AssetId != null)
        {
            var entity = await _context.AssetTags
                .Where(x => x.AssetId == request.AssetId && x.TagId == request.TagId)
                .FirstOrDefaultAsync(cancellationToken: cancellationToken);

            _context.AssetTags.Remove(entity!);

        }

        if (request.FolderId != null)
        {
            var entity = await _context.FolderTags
                .Where(x => x.FolderId == request.FolderId && x.TagId == request.TagId)
                .FirstOrDefaultAsync(cancellationToken: cancellationToken);

            _context.FolderTags.Remove(entity!);
        }

        await _context.SaveChangesAsync(cancellationToken);
    }
}
