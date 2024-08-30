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

public class CreateAssetCommandHandler : IRequestHandler<CreateAssetCommand, int>
{
    private readonly IApplicationDbContext _context;

    public CreateAssetCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> Handle(CreateAssetCommand request, CancellationToken cancellationToken)
    {
        var entity = new Asset
        {
            Name = request.Name,
            Path = request.Url,
            SizeInKB = request.SizeInKB,
            ContentType = request.ContentType,
            FolderId = request.FolderId
        };

        _context.Assets.Add(entity);

        await _context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}
