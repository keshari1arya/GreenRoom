using GreenRoom.Application.Common.Models;
using GreenRoom.Application.Users.Commands.AddTenantClaim;
using GreenRoom.Application.Users.Commands.VerifyUserInvitation;
using GreenRoom.Application.Users.Queries.SearchUser;
using Microsoft.AspNetCore.Mvc;

namespace GreenRoom.Web.Endpoints;

public class Users : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .MapGet(SearchUsers, "Search")
            .MapPost(AddTenantClaims, "AddTenantClaim")
            .MapPost(VerifyUserInvitation, "VerifyUserInvitation")
            .MapIdentityApi<ApplicationUser>();
    }
    public Task AddTenantClaims(ISender sender, AddTenantClaimCommand command)
    {
        return sender.Send(command);
    }

    public Task<IEnumerable<SearchUserDto>> SearchUsers(ISender sender, [FromQuery] string searchTerm)
    {
        return sender.Send(new SearchUserQuery(searchTerm));
    }

    private Task<VerifyUserInvitationResponse> VerifyUserInvitation(ISender sender, VerifyUserInvitationCommand command)
    {
        return sender.Send(command);
    }
}
