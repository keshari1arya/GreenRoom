using GreenRoom.Application.Common.Extension;
using GreenRoom.Application.Common.Interfaces;

namespace GreenRoom.Application.Tags.Commands.UpdateTag;

public record UpdateTagCommand(int Id, string Name) : IRequest<int>;

public class UpdateTagCommandValidator : AbstractValidator<UpdateTagCommand>
{
    public UpdateTagCommandValidator(IApplicationDbContext _context)
    {
        RuleFor(v => v.Id)
            .GreaterThan(0)
            .IdMustExistInDatabase(_context.Tags);

        RuleFor(v => v.Name)
            .NotEmpty()
            .MaximumLength(200);
    }
}

public class UpdateTagCommandHandler : IRequestHandler<UpdateTagCommand, int>
{
    private readonly IApplicationDbContext _context;

    public UpdateTagCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> Handle(UpdateTagCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Tags.FindAsync([request.Id], cancellationToken: cancellationToken);

        entity!.Name = request.Name;

        await _context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}
