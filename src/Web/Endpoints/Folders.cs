
using GreenRoom.Application.Folders.Commands.CreateFolder;
using GreenRoom.Application.Folders.Commands.MoveFolders;
using GreenRoom.Application.Folders.Commands.RenameFolder;
using GreenRoom.Application.Folders.Commands.RestoreFolders;
using GreenRoom.Application.Folders.Commands.TrashFolders;
using GreenRoom.Application.Folders.Queries.GetFolders;

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
            .MapPut(RenameFolder, "Rename");
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
}
