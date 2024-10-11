using GreenRoom.Application.Common.Extension;
using GreenRoom.Application.Common.Interfaces;
using GreenRoom.Domain.Entities.DigitalAssetManager;

namespace GreenRoom.Application.Assets.Commands.AddTagToAsset;

public record AddTagToAssetCommand(int AssetId, string Tag) : IRequest<int>;

public class AddTagToAssetCommandValidator : AbstractValidator<AddTagToAssetCommand>
{
    public AddTagToAssetCommandValidator(IApplicationDbContext context)
    {
        RuleFor(v => v.AssetId)
        .NotEmpty()
        .IdMustExistInDatabase(context.Assets);

        RuleFor(v => v.Tag).NotEmpty();
    }
}

public class AddTagToAssetCommandHandler(IApplicationDbContext context) : IRequestHandler<AddTagToAssetCommand, int>
{
    public async Task<int> Handle(AddTagToAssetCommand request, CancellationToken cancellationToken)
    {
        var tag = context.Tags.FirstOrDefault(t => t.Name == request.Tag);
        if (tag == null)
        {
            tag = new Tag { Name = request.Tag };
            context.Tags.Add(tag);
            await context.SaveChangesAsync(cancellationToken);
        }

        var assetTag = new AssetTag { AssetId = request.AssetId, TagId = tag.Id };
        context.AssetTags.Add(assetTag);
        return await context.SaveChangesAsync(cancellationToken);
    }
}
