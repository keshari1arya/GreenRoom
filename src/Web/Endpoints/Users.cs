using GreenRoom.Application.Users.Commands.AddTenantClaim;
using GreenRoom.Infrastructure.Identity;

namespace GreenRoom.Web.Endpoints;

public class Users : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .MapPost(AddTenantClaims, "AddTenantClaim")
            .MapIdentityApi<ApplicationUser>();
    }
    public Task AddTenantClaims(ISender sender, AddTenantClaimCommand command)
    {
        return sender.Send(command);
    }
}
