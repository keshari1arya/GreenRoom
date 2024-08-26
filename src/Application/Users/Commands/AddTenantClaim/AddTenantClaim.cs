using System.Security.Claims;
using GreenRoom.Application.Common.Interfaces;

namespace GreenRoom.Application.Users.Commands.AddTenantClaim;

public record AddTenantClaimCommand : IRequest
{
}

public class AddTenantClaimCommandValidator : AbstractValidator<AddTenantClaimCommand>
{
    public AddTenantClaimCommandValidator()
    {
    }
}

public class AddTenantClaimCommandHandler : IRequestHandler<AddTenantClaimCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly IIdentityService _identityService;
    private readonly IUser _user;

    public AddTenantClaimCommandHandler(IApplicationDbContext context, IIdentityService identityService, IUser user)
    {
        _context = context;
        _identityService = identityService;
        _user = user;
    }

    public async Task Handle(AddTenantClaimCommand request, CancellationToken cancellationToken)
    {
        List<Claim> claims = new List<Claim>{
            new Claim("tenant", "current tenant id")
        };
        await _identityService.AddClaimsAsync(_user.Id!, claims.ToArray());
    }
}
