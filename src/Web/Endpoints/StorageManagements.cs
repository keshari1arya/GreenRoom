using GreenRoom.Application.FileManagements.Commands.GenerateUrlToUploadFile;

namespace GreenRoom.Web.Endpoints;

public class StorageManagements : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .RequireAuthorization()
            .MapPost(GenerateUrlToUploadFile);
    }

    private Task<string> GenerateUrlToUploadFile(ISender sender, GenerateUrlToUploadFileCommand command)
    {
        return sender.Send(command);
    }
}
