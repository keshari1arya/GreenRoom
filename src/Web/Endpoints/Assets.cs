using GreenRoom.Application.Assets.Commands.AddTagToAsset;
using GreenRoom.Application.Assets.Commands.CreateAsset;
using GreenRoom.Application.Assets.Commands.MoveAssets;
using GreenRoom.Application.Assets.Commands.RemoveTagFromAsset;
using GreenRoom.Application.Assets.Commands.RestoreAssets;
using GreenRoom.Application.Assets.Commands.TrashAssets;
using GreenRoom.Application.Assets.Queries.GetAssetDetails;
using GreenRoom.Application.Assets.Queries.GetAssetsByFolderId;
using GreenRoom.Application.Assets.Queries.SearchAssets;
using GreenRoom.Application.Common.Models;
using Microsoft.AspNetCore.Mvc;

namespace GreenRoom.Web.Endpoints;

public class Assets : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .RequireAuthorization()
            .MapGet(GetAssets)
            .MapGet(GetAssetDetails, "{id}")
            .MapPost(CreateAsset)
            .MapPut(MoveAsset, "Move")
            .MapPut(TrashAssets, "Trash")
            .MapPut(RestoreAssets, "Restore")
            .MapGet(SearchAssets, "Search")
            .MapPut(AddTagToAsset, "{assetId}/AddTag")
            .MapDelete(RemoveTagFromAsset, "{assetId}/RemoveTag");
    }

    private Task<PaginatedList<AssetDto>> GetAssets(ISender sender, [AsParameters] GetAssetsByFolderIdQuery query)
    {
        return sender.Send(query);
    }

    private Task<AssetDetailsDto> GetAssetDetails(ISender sender, int id)
    {
        return sender.Send(new GetAssetDetailsQuery(id));
    }

    private Task<int> CreateAsset(ISender sender, CreateAssetCommand command)
    {
        return sender.Send(command);
    }

    private Task MoveAsset(ISender sender, MoveAssetsCommand command)
    {
        return sender.Send(command);
    }

    private Task TrashAssets(ISender sender, TrashAssetsCommand command)
    {
        return sender.Send(command);
    }

    private Task RestoreAssets(ISender sender, RestoreAssetsCommand command)
    {
        return sender.Send(command);
    }

    private Task<PaginatedList<AssetDto>> SearchAssets(ISender sender, [FromQuery] int? folderId, [FromQuery] string searchTerm)
    {
        var query = new SearchAssetsQuery
        {
            ParentFolderId = folderId,
            SearchTerm = searchTerm
        };
        return sender.Send(query);
    }

    private Task<int> AddTagToAsset(ISender sender, [FromRoute] int assetId, [FromQuery] string tag)
    {
        var command = new AddTagToAssetCommand(assetId, tag);
        return sender.Send(command);
    }

    private Task<int> RemoveTagFromAsset(ISender sender, [FromRoute] int assetId, [FromQuery] string tag)
    {
        var command = new RemoveTagFromAssetCommand(assetId, tag);
        return sender.Send(command);
    }
}
