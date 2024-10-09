using GreenRoom.Application.Common.Extension;
using GreenRoom.Application.Common.Interfaces;
using GreenRoom.Domain.Entities.DigitalAssetManager;

namespace GreenRoom.Application.Assets.Commands.CreateAsset;

public record CreateAssetCommand(
    string Name,
    string Url,
    int SizeInKB,
    string ContentType,
    int? FolderId
) : IRequest<int>;

public class CreateAssetCommandValidator : AbstractValidator<CreateAssetCommand>
{
    public CreateAssetCommandValidator(IApplicationDbContext context)
    {
        RuleFor(v => v.Name)
            .NotEmpty();

        RuleFor(v => v.Url)
            .NotEmpty();

        RuleFor(v => v.SizeInKB)
            .GreaterThan(0)
            .NotEmpty();

        RuleFor(v => v.ContentType)
            .NotEmpty();

        RuleFor(v => v.FolderId)
            .IdMustExistIfNotNull(context.Folders);
    }
}

public class CreateAssetCommandHandler(IApplicationDbContext context) : IRequestHandler<CreateAssetCommand, int>
{
    public async Task<int> Handle(CreateAssetCommand request, CancellationToken cancellationToken)
    {
        var uri = new Uri(request.Url);
        var segments = uri.AbsolutePath.Split('/');
        var path = string.Join("/", segments.Skip(2));
        var entity = new Asset
        {
            Name = request.Name,
            Path = request.Name,
            SizeInKB = request.SizeInKB,
            ContentType = request.ContentType,
            FolderId = request.FolderId
        };

        context.Assets.Add(entity);

        await context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}
