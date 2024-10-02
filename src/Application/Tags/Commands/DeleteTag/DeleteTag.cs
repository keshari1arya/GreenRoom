using GreenRoom.Application.Common.Extension;
using GreenRoom.Application.Common.Interfaces;

namespace GreenRoom.Application.Tags.Commands.DeleteTag;

public record DeleteTagCommand(int Id) : IRequest;

public class DeleteTagCommandValidator : AbstractValidator<DeleteTagCommand>
{
    public DeleteTagCommandValidator(IApplicationDbContext _context)
    {
        RuleFor(v => v.Id)
        .GreaterThan(0)
        .IdMustExistInDatabase(_context.Tags);
    }
}

public class DeleteTagCommandHandler : IRequestHandler<DeleteTagCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteTagCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(DeleteTagCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Tags.FindAsync([request.Id], cancellationToken: cancellationToken);

        _context.Tags.Remove(entity!);

        await _context.SaveChangesAsync(cancellationToken);
    }
}
