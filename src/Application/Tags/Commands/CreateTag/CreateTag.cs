using GreenRoom.Application.Common.Interfaces;
using GreenRoom.Domain.Entities.DigitalAssetManager;

namespace GreenRoom.Application.Tags.Commands.CreateTag;

public record CreateTagCommand(string Name) : IRequest<int>;

public class CreateTagCommandValidator : AbstractValidator<CreateTagCommand>
{
    public CreateTagCommandValidator()
    {
        RuleFor(v => v.Name)
            .NotEmpty()
            .MinimumLength(3);
    }
}

public class CreateTagCommandHandler : IRequestHandler<CreateTagCommand, int>
{
    private readonly IApplicationDbContext _context;

    public CreateTagCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> Handle(CreateTagCommand request, CancellationToken cancellationToken)
    {
        var entity = new Tag
        {
            Name = request.Name
        };

        _context.Tags.Add(entity);

        await _context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}
