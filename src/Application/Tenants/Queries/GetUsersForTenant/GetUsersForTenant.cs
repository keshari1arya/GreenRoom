using GreenRoom.Application.Common.Extension;
using GreenRoom.Application.Common.Interfaces;
using GreenRoom.Domain.Constants;
using Microsoft.AspNetCore.Identity;

namespace GreenRoom.Application.Tenants.Queries.GetUsersForTenant;

public record GetUsersForTenantQuery : IRequest<IEnumerable<TenantUsersDto>>;

public class GetUsersForTenantQueryValidator : AbstractValidator<GetUsersForTenantQuery>
{
    public GetUsersForTenantQueryValidator(IApplicationDbContext context)
    {

    }
}

public class GetUsersForTenantQueryHandler : IRequestHandler<GetUsersForTenantQuery, IEnumerable<TenantUsersDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IUser _user;
    private readonly IMapper _mapper;
    private readonly IMultiTenancyService _multiTenancyService;

    public GetUsersForTenantQueryHandler(IApplicationDbContext context, IMapper mapper, IUser user, IMultiTenancyService multiTenancyService)
    {
        _context = context;
        _mapper = mapper;
        _user = user;
        _multiTenancyService = multiTenancyService;
    }

    public Task<IEnumerable<TenantUsersDto>> Handle(GetUsersForTenantQuery request, CancellationToken cancellationToken)
    {
        // mock and return 20 users
        var users = new List<TenantUsersDto>();
        for (int i = 0; i < 20; i++)
        {
            users.Add(new TenantUsersDto
            {
                Id = i,
                Name = $"User {i}",
                Email = "user" + i + "@example.com",
                Role = i / 2 == 0 ? Roles.Administrator : Roles.User,
                IsActive = true
            });

        }
        return Task.FromResult(users.AsEnumerable());
    }
}

public class TenantUsersDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public bool IsActive { get; set; }
}