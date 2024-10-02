using GreenRoom.Application.Common.Extension;
using GreenRoom.Application.Common.Interfaces;
using GreenRoom.Domain.Entities.DigitalAssetManager;

namespace GreenRoom.Application.Tags.Commands.AttachTag;

public record AttachTagCommand(int TagId, int? AssetId, int? FolderId) : IRequest;

public class AttachTagCommandValidator : AbstractValidator<AttachTagCommand>
{
    public AttachTagCommandValidator(IApplicationDbContext _context)
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

public class AttachTagCommandHandler : IRequestHandler<AttachTagCommand>
{
    private readonly IApplicationDbContext _context;

    public AttachTagCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(AttachTagCommand request, CancellationToken cancellationToken)
    {

        if (request.AssetId != null)
        {
            _context.AssetTags.Add(new AssetTag
            {
                AssetId = request.AssetId.Value,
                TagId = request.TagId
            });
        }

        if (request.FolderId != null)
        {
            _context.FolderTags.Add(new FolderTag
            {
                FolderId = request.FolderId.Value,
                TagId = request.TagId
            });
        }

        await _context.SaveChangesAsync(cancellationToken);
    }
}
