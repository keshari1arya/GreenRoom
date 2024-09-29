using GreenRoom.Application.Assets.Commands.CreateAsset;
using GreenRoom.Application.Assets.Commands.MoveAssets;
using GreenRoom.Application.Assets.Commands.RestoreAssets;
using GreenRoom.Application.Assets.Commands.TrashAssets;
using GreenRoom.Application.Assets.Queries.GetAssetsByFolderId;
using GreenRoom.Application.Assets.Queries.SearchAssets;
using Microsoft.AspNetCore.Mvc;

namespace GreenRoom.Web.Endpoints;

public class Assets : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .RequireAuthorization()
            .MapGet(GetAssets)
            .MapPost(CreateAsset)
            .MapPut(MoveAsset, "Move")
            .MapPut(TrashAssets, "Trash")
            .MapPut(RestoreAssets, "Restore")
            .MapGet(SearchAssets, "Search");
    }

    private Task<IEnumerable<AssetDto>> GetAssets(ISender sender, [AsParameters] GetAssetsByFolderIdQuery query)
    {
        return sender.Send(query);
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

    private Task<IEnumerable<AssetDto>> SearchAssets(ISender sender, [FromQuery] int? folderId, [FromQuery] string searchTerm)
    {
        var query = new SearchAssetsQuery
        {
            ParentFolderId = folderId,
            SearchTerm = searchTerm
        };
        return sender.Send(query);
    }
}
