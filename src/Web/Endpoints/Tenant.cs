using GreenRoom.Application.Tenants.Commands.AddTenantSubscription;
using GreenRoom.Application.Tenants.Commands.CreateTenant;
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
            .MapPost(AddTenantSubscription, "subscription");
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
}
