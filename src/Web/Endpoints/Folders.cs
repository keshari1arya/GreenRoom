
using GreenRoom.Application.Folders.Commands.CreateFolder;
using GreenRoom.Application.Folders.Commands.GetTrashed;
using GreenRoom.Application.Folders.Commands.MoveFolders;
using GreenRoom.Application.Folders.Commands.RenameFolder;
using GreenRoom.Application.Folders.Commands.RestoreFolders;
using GreenRoom.Application.Folders.Commands.ToggleFolderPin;
using GreenRoom.Application.Folders.Commands.TrashFolders;
using GreenRoom.Application.Folders.Queries.GetFolderPathToRoot;
using GreenRoom.Application.Folders.Queries.GetFolders;
using GreenRoom.Application.Folders.Queries.GetFoldersWithStructure;
using GreenRoom.Application.Folders.Queries.GetPinnedFolders;
using GreenRoom.Application.Folders.Queries.SearchFolders;
using Microsoft.AspNetCore.Mvc;

namespace GreenRoom.Web.Endpoints;

public class Folders : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .RequireAuthorization()
            .MapGet(GetFolders)
            .MapPost(CreateFolder)
            .MapPut(MoveFolder, "Move")
            .MapPut(TrashFolder, "Trash")
            .MapPut(RestoreFolder, "Restore")
            .MapPut(RenameFolder, "Rename")
            .MapGet(GetFolderPathToRoot, "PathToRoot/{folderId}")
            .MapGet(GetTrashed, "Trashed")
            .MapGet(SearchFolders, "Search")
            .MapGet(GetPinnedFolders, "Pinned")
            .MapPut(ToggleFolderPin, "TogglePin")
            .MapGet(GetFoldersWithStructure, "WithStructure");
    }

    private Task<IEnumerable<FolderDto>> GetFolders(ISender sender, [AsParameters] GetFoldersQuery query)
    {
        return sender.Send(query);
    }

    private Task<int> CreateFolder(ISender sender, CreateFolderCommand command)
    {
        return sender.Send(command);
    }

    private Task MoveFolder(ISender sender, MoveFoldersCommand command)
    {
        return sender.Send(command);
    }

    private Task TrashFolder(ISender sender, TrashFoldersCommand command)
    {
        return sender.Send(command);
    }

    private Task RestoreFolder(ISender sender, RestoreFoldersCommand command)
    {
        return sender.Send(command);
    }

    private Task RenameFolder(ISender sender, RenameFolderCommand command)
    {
        return sender.Send(command);
    }
    private Task<IEnumerable<PathToRootDto>> GetFolderPathToRoot(ISender sender, [FromRoute] int? folderId)
    {
        return sender.Send(new GetFolderPathToRootQuery(folderId));
    }

    private Task<TrashFolderAndFilesDto[]> GetTrashed(ISender sender)
    {
        return sender.Send(new GetTrashedCommand());
    }

    private Task<IEnumerable<FolderDto>> SearchFolders(ISender sender, [FromQuery] int? folderId, [FromQuery] string searchTerm)
    {
        var query = new SearchFoldersQuery
        {
            ParentFolderId = folderId,
            SearchTerm = searchTerm
        };
        return sender.Send(query);
    }

    private Task<IEnumerable<FolderDto>> GetPinnedFolders(ISender sender)
    {
        return sender.Send(new GetPinnedFoldersQuery());
    }

    private Task<int> ToggleFolderPin(ISender sender, ToggleFolderPinCommand command)
    {
        return sender.Send(command);
    }

    private Task<List<FolderDto>> GetFoldersWithStructure(ISender sender)
    {
        return sender.Send(new GetFoldersWithStructureQuery());
    }
}
