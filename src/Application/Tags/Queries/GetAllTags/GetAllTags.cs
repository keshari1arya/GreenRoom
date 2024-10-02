using GreenRoom.Application.Common.Interfaces;
using GreenRoom.Domain.Entities.DigitalAssetManager;

namespace GreenRoom.Application.Tags.Queries.GetAllTags;

public record GetAllTagsQuery : IRequest<TagDto[]>
{
}

public class GetAllTagsQueryValidator : AbstractValidator<GetAllTagsQuery>
{
    public GetAllTagsQueryValidator()
    {
    }
}

public class GetAllTagsQueryHandler : IRequestHandler<GetAllTagsQuery, TagDto[]>
{
    private readonly IApplicationDbContext _context;

    public GetAllTagsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<TagDto[]> Handle(GetAllTagsQuery request, CancellationToken cancellationToken)
    {
        return await _context.Tags
            .Select(t => new TagDto
            {
                Id = t.Id,
                Name = t.Name!
            })
            .ToArrayAsync(cancellationToken: cancellationToken);
    }
}

public class TagDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;

    private class TagDtoProfile : Profile
    {
        public TagDtoProfile()
        {
            CreateMap<Tag, TagDto>();
        }
    }
}
