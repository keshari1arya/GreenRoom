using GreenRoom.Application.Common.Extension;
using GreenRoom.Application.Common.Interfaces;
using GreenRoom.Domain.Entities.DigitalAssetManager;

namespace GreenRoom.Application.Folders.Commands.ToggleFolderPin;

public record ToggleFolderPinCommand(int FolderId) : IRequest<int>;

public class ToggleFolderPinCommandValidator : AbstractValidator<ToggleFolderPinCommand>
{
    public ToggleFolderPinCommandValidator(IApplicationDbContext context)
    {
        RuleFor(v => v.FolderId)
            .NotEmpty()
            .IdMustExistInDatabase(context.Folders);
    }
}

public class ToggleFolderPinCommandHandler : IRequestHandler<ToggleFolderPinCommand, int>
{
    private readonly IApplicationDbContext _context;
    private readonly IUser _user;
    private readonly IMultiTenancyService _multiTenancyService;

    public ToggleFolderPinCommandHandler(IApplicationDbContext context, IUser user, IMultiTenancyService multiTenancyService)
    {
        _context = context;
        _user = user;
        _multiTenancyService = multiTenancyService;
    }

    public async Task<int> Handle(ToggleFolderPinCommand request, CancellationToken cancellationToken)
    {
        var folderPin = await _context.FolderPins
            .Where(x => x.FolderId == request.FolderId && x.UserId == _user.Id)
            .FirstOrDefaultAsync(cancellationToken);

        if (folderPin is not null)
        {
            _context.FolderPins.Remove(folderPin);
        }
        else
        {
            folderPin = new FolderPin
            {
                FolderId = request.FolderId,
                UserId = _user.Id!,
                TenantId = _multiTenancyService.CurrentTenantId
            };

            await _context.FolderPins.AddAsync(folderPin, cancellationToken);
        }

        return await _context.SaveChangesAsync(cancellationToken);
    }
}
