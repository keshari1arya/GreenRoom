using GreenRoom.Application.Common.Extension;
using GreenRoom.Application.Common.Interfaces;

namespace GreenRoom.Application.Assets.Commands.TrashAssets;

public record TrashAssetsCommand(int[] Ids) : IRequest;

public class TrashAssetsCommandValidator : AbstractValidator<TrashAssetsCommand>
{
    public TrashAssetsCommandValidator(IApplicationDbContext dbContext)
    {
        RuleFor(v => v.Ids)
            .IdsMustExistInDatabase(dbContext.Assets);
    }
}

public class TrashAssetsCommandHandler : IRequestHandler<TrashAssetsCommand>
{
    private readonly IApplicationDbContext _context;

    public TrashAssetsCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(TrashAssetsCommand request, CancellationToken cancellationToken)
    {
        var entities = _context.Assets
            .Where(x => request.Ids.Contains(x.Id));
        await entities.ForEachAsync(x => x.IsTrashed = true);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
