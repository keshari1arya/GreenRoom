using GreenRoom.Application.FileManagements.Commands.GenerateUrlToUploadFile;

namespace GreenRoom.Web.Endpoints;

public class StorageManagements : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .RequireAuthorization()
            .MapPost(GenerateUrlToUploadFile, "GeneratePresignedUrl");
    }

    private Task<PreSignedUrlDto> GenerateUrlToUploadFile(ISender sender, GenerateUrlToUploadFileCommand command)
    {
        return sender.Send(command);
    }
}
