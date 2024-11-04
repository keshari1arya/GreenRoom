using GreenRoom.Application.FileManagements.Commands.GenerateUrlToUploadFile;
using GreenRoom.Application.FileManagements.Queries.GetBucketSize;
using GreenRoom.Application.FileManagements.Queries.GetBucketStorageStatus;
using Microsoft.AspNetCore.Mvc;

namespace GreenRoom.Web.Endpoints;

public class StorageManagements : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .RequireAuthorization()
            .MapPost(GenerateUrlToUploadFile, "GeneratePresignedUrl")
            .MapGet(GetBucketSize, "GetBucketSize")
            .MapGet(GetBucketStorageStatus, "GetBucketStorageStatus");
    }

    private Task<PreSignedUrlDto> GenerateUrlToUploadFile(ISender sender, GenerateUrlToUploadFileCommand command)
    {
        return sender.Send(command);
    }

    private Task<long> GetBucketSize(ISender sender)
    {
        return sender.Send(new GetBucketSizeQuery());
    }

    private Task<IEnumerable<BucketStorageStatusByAssetTypeDto>> GetBucketStorageStatus(ISender sender)
    {
        return sender.Send(new GetBucketStorageStatusQuery());
    }
}
