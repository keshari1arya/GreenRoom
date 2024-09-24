using GreenRoom.Application.Tenants.Commands.AddTenantSubscription;
using GreenRoom.Application.Tenants.Commands.AddTenantUsers;
using GreenRoom.Application.Tenants.Commands.CreateTenant;
using GreenRoom.Application.Tenants.Commands.RemoveTenantUsers;
using GreenRoom.Application.Tenants.Commands.UpdateRole;
using GreenRoom.Application.Tenants.Queries.GetTenants;
using GreenRoom.Application.Tenants.Queries.TenantDetails;
using Microsoft.AspNetCore.Mvc;

namespace GreenRoom.Web.Endpoints;

public class Tenant : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .RequireAuthorization()
            .MapGet(GetTenants)
            .MapGet(GetTenantDetails, "{id}")
            .MapPost(CreateTenant)
            .MapPost(AddTenantSubscription, "Subscription")
            .MapPost(AddTenantUsers, "Users")
            .MapDelete(RemoveTenantUsers, "Users")
            .MapPatch(UpdateRole, "Users/Role");
    }

    private Task<IEnumerable<TenantDto>> GetTenants(ISender sender)
    {
        return sender.Send(new GetTenantsQuery());
    }

    private Task<IEnumerable<TenantDto>> GetTenantDetails(ISender sender, int id)
    {
        return sender.Send(new TenantDetailsQuery(id));
    }

    private Task<int> CreateTenant(ISender sender, CreateTenantCommand command)
    {
        return sender.Send(command);
    }

    private Task<int> AddTenantSubscription(ISender sender, AddTenantSubscriptionCommand command)
    {
        return sender.Send(command);
    }

    private Task<int> AddTenantUsers(ISender sender, [FromBody] AddTenantUsersCommand command)
    {
        return sender.Send(command);
    }

    private Task<int> RemoveTenantUsers(ISender sender, [FromBody] RemoveTenantUsersCommand command)
    {
        return sender.Send(command);
    }

    private Task<int> UpdateRole(ISender sender, [FromBody] UpdateRoleCommand command)
    {
        return sender.Send(command);
    }
}
