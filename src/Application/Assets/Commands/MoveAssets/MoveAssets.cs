using GreenRoom.Application.Common.Extension;
using GreenRoom.Application.Common.Interfaces;

namespace GreenRoom.Application.Assets.Commands.MoveAssets;

public record MoveAssetsCommand(
    int[] Ids,
    int DestinationFolderId
) : IRequest;

public class MoveAssetsCommandValidator : AbstractValidator<MoveAssetsCommand>
{
    public MoveAssetsCommandValidator(IApplicationDbContext context)
    {
        RuleFor(v => v.Ids)
            .NotEmpty()
            .IdsMustExistInDatabase(context.Assets);

        RuleFor(v => v.DestinationFolderId)
            .IdMustExistInDatabase(context.Folders);
    }
}

public class MoveAssetsCommandHandler : IRequestHandler<MoveAssetsCommand>
{
    private readonly IApplicationDbContext _context;

    public MoveAssetsCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(MoveAssetsCommand request, CancellationToken cancellationToken)
    {
        var entities = _context.Assets
            .Where(x => request.Ids.Contains(x.Id));
        await entities.ForEachAsync(x => x.FolderId = request.DestinationFolderId);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
