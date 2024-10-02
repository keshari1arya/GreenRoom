using GreenRoom.Application.Tenants.Commands.AddTenantSubscription;
using GreenRoom.Application.Tenants.Commands.AddTenantUsers;
using GreenRoom.Application.Tenants.Commands.CreateTenant;
using GreenRoom.Application.Tenants.Commands.RemoveTenantUsers;
using GreenRoom.Application.Tenants.Commands.UpdateRole;
using GreenRoom.Application.Tenants.Commands.UpdateTenant;
using GreenRoom.Application.Tenants.Queries.GetActiveTenants;
using GreenRoom.Application.Tenants.Queries.GetCurrentTenant;
using GreenRoom.Application.Tenants.Queries.GetTenants;
using GreenRoom.Application.Tenants.Queries.GetUsersForTenant;
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
            .MapGet(MyTenants, "Mine")
            .MapGet(GetCurrentTenant, "Current")
            .MapPost(CreateTenant)
            .MapPut(UpdateTenant, "{id}")
            .MapPost(AddTenantSubscription, "Subscription")
            .MapGet(GetUsersForTenant, "Users")
            .MapPost(AddTenantUsers, "Users")
            .MapDelete(RemoveTenantUsers, "Users")
            .MapPatch(UpdateRole, "Users/Role");
    }

    private Task<IEnumerable<TenantDto>> GetTenants(ISender sender)
    {
        return sender.Send(new GetTenantsQuery());
    }

    private Task<TenantDto> GetTenantDetails(ISender sender, int id)
    {
        return sender.Send(new TenantDetailsQuery(id));
    }

    private Task<int> CreateTenant(ISender sender, CreateTenantCommand command)
    {
        return sender.Send(command);
    }

    private Task<int> UpdateTenant(ISender sender, [FromRoute] int id, [FromBody] UpdateTenantCommand command)
    {
        return sender.Send(command);
    }

    private Task<TenantDetailsDto> GetCurrentTenant(ISender sender)
    {
        return sender.Send(new GetCurrentTenantQuery());
    }

    private Task<TenantDto[]> MyTenants(ISender sender)
    {
        return sender.Send(new GetActiveTenantsQuery());
    }

    private Task<int> AddTenantSubscription(ISender sender, AddTenantSubscriptionCommand command)
    {
        return sender.Send(command);
    }

    private Task<IEnumerable<TenantUsersDto>> GetUsersForTenant(ISender sender)
    {
        return sender.Send(new GetUsersForTenantQuery());
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
