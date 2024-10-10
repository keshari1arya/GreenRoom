using GreenRoom.Application.Common.Extension;
using GreenRoom.Application.Common.Interfaces;

namespace GreenRoom.Application.Assets.Commands.RemoveTagFromAsset;

public record RemoveTagFromAssetCommand(int AssetId, string Tag) : IRequest<int>;
public class RemoveTagFromAssetCommandValidator : AbstractValidator<RemoveTagFromAssetCommand>
{
    public RemoveTagFromAssetCommandValidator(IApplicationDbContext context)
    {
        RuleFor(v => v.AssetId)
            .IdMustExistInDatabase(context.Assets);

        RuleFor(v => v.Tag)
            .NotEmpty()
            .Must(x =>
            {
                var assetTag = context.AssetTags
                  .Include(at => at.Tag)
                  .FirstOrDefault(at => at.Tag != null && at.Tag.Name == x);
                return assetTag != null;
            })
            .WithMessage("Tag does not exist or is not associated with the asset.");
    }
}

public class RemoveTagFromAssetCommandHandler(IApplicationDbContext context) : IRequestHandler<RemoveTagFromAssetCommand, int>
{

    public async Task<int> Handle(RemoveTagFromAssetCommand request, CancellationToken cancellationToken)
    {
        var assetTag = context.AssetTags
            .Include(at => at.Tag)
            .First(at => at.Tag != null && at.Tag.Name == request.Tag && at.AssetId == request.AssetId);

        context.AssetTags.Remove(assetTag);
        return await context.SaveChangesAsync(cancellationToken);
    }
}
