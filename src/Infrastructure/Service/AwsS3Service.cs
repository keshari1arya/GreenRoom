using Amazon.S3;
using Amazon.S3.Model;
using GreenRoom.Application.Common.Interfaces;
using GreenRoom.Application.Interfaces;

namespace GreenRoom.Infrastructure.Service;
public class AwsS3Service(
    IAmazonS3 s3Client,
    IApplicationDbContext dbContext,
    IMultiTenancyService multiTenancyService
    ) : IStorageManagementService
{
    private const string ASSET_CONTAINER = "AssetContainer";
    public string GenerateUrlToUpload(string fileName, string contentType, int expiryInSeconds)
    {
        var tenant = dbContext.Tenants.Find(multiTenancyService.CurrentTenantId);
        var bucketName = tenant!.Id.ToString();

        var request = new GetPreSignedUrlRequest
        {
            BucketName = bucketName,
            Key = $"{ASSET_CONTAINER}/{fileName}",
            Verb = HttpVerb.PUT,
            Expires = DateTime.Now.AddSeconds(expiryInSeconds),
            ContentType = contentType,
        };

        return s3Client.GetPreSignedURL(request);
    }

    public string GenerateUrlToDownload(string path, int expiryInSeconds)
    {
        var tenant = dbContext.Tenants.Find(multiTenancyService.CurrentTenantId);
        var bucketName = tenant!.Id.ToString();

        var request = new GetPreSignedUrlRequest
        {
            BucketName = bucketName,
            Key = $"{ASSET_CONTAINER}/{path}",
            Verb = HttpVerb.GET,
            Expires = DateTime.Now.AddSeconds(expiryInSeconds),
        };

        return s3Client.GetPreSignedURL(request);
    }
}
