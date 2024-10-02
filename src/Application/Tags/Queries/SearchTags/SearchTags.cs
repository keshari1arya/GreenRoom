using GreenRoom.Application.Common.Interfaces;
using GreenRoom.Application.Tags.Queries.GetAllTags;

namespace GreenRoom.Application.Tags.Queries.SearchTags;

public record SearchTagsQuery : IRequest<TagDto[]>
{
    public string Name { get; set; } = string.Empty;
}

public class SearchTagsQueryValidator : AbstractValidator<SearchTagsQuery>
{
    public SearchTagsQueryValidator()
    {
        RuleFor(v => v.Name)
        .MinimumLength(3)
            .NotEmpty();
    }
}

public class SearchTagsQueryHandler : IRequestHandler<SearchTagsQuery, TagDto[]>
{
    private readonly IApplicationDbContext _context;

    public SearchTagsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public Task<TagDto[]> Handle(SearchTagsQuery request, CancellationToken cancellationToken)
    {
        return _context.Tags
            .Where(t => t.Name!.Contains(request.Name))
            .Select(t => new TagDto
            {
                Id = t.Id,
                Name = t.Name!
            })
            .ToArrayAsync(cancellationToken: cancellationToken);
    }
}
