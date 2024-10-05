using GreenRoom.Application.Common.Interfaces;
using GreenRoom.Application.Common.Models;
using Microsoft.AspNetCore.Identity;

namespace GreenRoom.Application.Users.Queries.SearchUser;

public record SearchUserQuery(string SearchTerm) : IRequest<IEnumerable<SearchUserDto>>;
public class SearchUserQueryValidator : AbstractValidator<SearchUserQuery>
{
    public SearchUserQueryValidator()
    {
        RuleFor(v => v.SearchTerm)
            .NotEmpty().WithMessage("Search term is required.");
    }
}

public class SearchUserQueryHandler : IRequestHandler<SearchUserQuery, IEnumerable<SearchUserDto>>
{
    private readonly UserManager<ApplicationUser> _userManager;

    public SearchUserQueryHandler(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    public async Task<IEnumerable<SearchUserDto>> Handle(SearchUserQuery request, CancellationToken cancellationToken)
    {
        var users = await _userManager.Users
            .Where(x => (x.UserName != null && x.UserName.Contains(request.SearchTerm))
             || (x.Email != null && x.Email.Contains(request.SearchTerm)
             || (x.FirstName != null && x.FirstName.Contains(request.SearchTerm)
                || (x.LastName != null && x.LastName.Contains(request.SearchTerm)))))
            .Select(x => new SearchUserDto
            {
                Id = x.Id,
                UserName = x.UserName,
                Email = x.Email,
                FirstName = x.FirstName,
                LastName = x.LastName
            })
            .ToListAsync(cancellationToken);
        return users;
    }
}

public class SearchUserDto
{
    public string Id { get; set; } = null!;
    public string? UserName { get; set; }
    public string? Email { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
}
