using GreenRoom.Application.Tags.Commands.AttachTag;
using GreenRoom.Application.Tags.Commands.CreateTag;
using GreenRoom.Application.Tags.Commands.DeleteTag;
using GreenRoom.Application.Tags.Commands.DetachTag;
using GreenRoom.Application.Tags.Commands.UpdateTag;
using GreenRoom.Application.Tags.Queries.GetAllTags;
using GreenRoom.Application.Tags.Queries.SearchTags;
using Microsoft.AspNetCore.Mvc;

namespace GreenRoom.Web.Endpoints;

public class Tags : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .RequireAuthorization()
            .MapGet(GetAllTags)
            .MapGet(SearchTags, "Search")
            .MapPost(CreateTag)
            .MapPut(UpdateTag, "{id}")
            .MapDelete(DeleteTag, "{id}")
            .MapPut(AttachTag, "{id}/Attach")
            .MapPut(DetachTag, "{id}/Detach");
    }

    private Task GetAllTags(ISender sender)
    {
        return sender.Send(new GetAllTagsQuery());
    }

    private Task<TagDto[]> SearchTags(ISender sender, [FromQuery] string name)
    {
        var query = new SearchTagsQuery
        {
            Name = name
        };
        return sender.Send(query);
    }

    private Task<int> CreateTag(ISender sender, [FromBody] CreateTagCommand command)
    {
        return sender.Send(command);
    }

    private Task<int> UpdateTag(ISender sender, [FromQuery] string name, [FromRoute] int id)
    {
        var command = new UpdateTagCommand(id, name);
        return sender.Send(command);
    }

    private Task DeleteTag(ISender sender, [FromRoute] int id)
    {
        var command = new DeleteTagCommand(id);
        return sender.Send(command);
    }

    private Task AttachTag(ISender sender, [FromRoute] int id, [FromQuery] int? folderId, [FromQuery] int? assetId)
    {
        var command = new AttachTagCommand(id, assetId, folderId);
        return sender.Send(command);
    }

    private Task DetachTag(ISender sender, [FromRoute] int id, [FromQuery] int? folderId, [FromQuery] int? assetId)
    {
        var command = new DetachTagCommand(id, assetId, folderId);
        return sender.Send(command);
    }
}
