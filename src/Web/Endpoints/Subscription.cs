using GreenRoom.Application.Subscriptions.Commands.CreateSubscription;
using GreenRoom.Application.Subscriptions.Commands.UpdateSubscription;
using GreenRoom.Application.Subscriptions.Commands.UpdateSubscriptionStatus;
using GreenRoom.Application.Subscriptions.Queries.GetSubscriptions;
using GreenRoom.Application.Subscriptions.Queries.GetSubscriptionDetails;
using Microsoft.AspNetCore.Mvc;

namespace GreenRoom.Web.Endpoints;

public class Subscription : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .MapGet(GetSubscriptions)
            .MapGet(GetSubscriptionDetails, "{id}")
            .MapPost(CreateSubscription)
            .MapPut(UpdateSubscription, "{id}")
            .MapPut(UpdateSubscriptionStatus, "{id}/UpdateStatus/{status}");
    }

    private Task<IEnumerable<SubscriptionDto>> GetSubscriptions(ISender sender)
    {
        return sender.Send(new GetSubscriptionsQuery());
    }

    private Task<SubscriptionDetailsDto> GetSubscriptionDetails(ISender sender, int id)
    {
        return sender.Send(new GetSubscriptionDetailsQuery(id));
    }
    private Task<int> CreateSubscription(ISender sender, CreateSubscriptionCommand command)
    {
        return sender.Send(command);
    }

    private Task UpdateSubscription(ISender sender, int id, UpdateSubscriptionCommand command)
    {
        command.Id = id;
        return sender.Send(command);
    }

    private Task UpdateSubscriptionStatus(ISender sender, int id, bool status)
    {
        var command = new UpdateSubscriptionStatusCommand(id, status);
        return sender.Send(command);
    }
}
