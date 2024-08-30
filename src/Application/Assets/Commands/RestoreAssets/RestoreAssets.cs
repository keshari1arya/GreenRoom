using GreenRoom.Application.Common.Extension;
using GreenRoom.Application.Common.Interfaces;

namespace GreenRoom.Application.Assets.Commands.RestoreAssets;

public record RestoreAssetsCommand(int[] Ids) : IRequest;

public class RestoreAssetsCommandValidator : AbstractValidator<RestoreAssetsCommand>
{
    public RestoreAssetsCommandValidator(IApplicationDbContext dbContext)
    {
        RuleFor(v => v.Ids)
            .NotEmpty()
            .IdsMustExistInDatabase(dbContext.Assets);
    }
}

public class RestoreAssetsCommandHandler : IRequestHandler<RestoreAssetsCommand>
{
    private readonly IApplicationDbContext _context;

    public RestoreAssetsCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(RestoreAssetsCommand request, CancellationToken cancellationToken)
    {
        var entities = _context.Assets
            .Where(x => request.Ids.Contains(x.Id));
        await entities.ForEachAsync(x => x.IsTrashed = false);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
