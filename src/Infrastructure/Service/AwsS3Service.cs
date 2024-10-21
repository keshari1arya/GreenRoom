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
    private const string ASSET_CONTAINER_FOLDER_NAME = "AssetContainer";
    public string GenerateUrlToUpload(string filePath, string contentType, int expiryInSeconds)
    {
        var tenant = dbContext.Tenants.Find(multiTenancyService.CurrentTenantId);
        var bucketName = tenant!.Id.ToString();

        var request = new GetPreSignedUrlRequest
        {
            BucketName = bucketName,
            Key = $"{ASSET_CONTAINER_FOLDER_NAME}/{filePath}",
            Verb = HttpVerb.PUT,
            Expires = DateTime.Now.AddSeconds(expiryInSeconds),
            ContentType = contentType,
        };

        return s3Client.GetPreSignedURL(request);
    }

    public string GenerateUrlToDownload(string filePath, int expiryInSeconds)
    {
        var tenant = dbContext.Tenants.Find(multiTenancyService.CurrentTenantId);
        var bucketName = tenant!.Id.ToString();

        var request = new GetPreSignedUrlRequest
        {
            BucketName = bucketName,
            Key = $"{ASSET_CONTAINER_FOLDER_NAME}/{filePath}",
            Verb = HttpVerb.GET,
            Expires = DateTime.Now.AddSeconds(expiryInSeconds),
        };

        return s3Client.GetPreSignedURL(request);
    }

    public async Task CreateBucketAsync(string bucketName)
    {
        var request = new PutBucketRequest
        {
            BucketName = bucketName,
        };

        await s3Client.PutBucketAsync(request);
    }

    public async Task CreateFolderAsync(string folderName)
    {
        var tenant = dbContext.Tenants.Find(multiTenancyService.CurrentTenantId);
        var bucketName = tenant!.Id.ToString();

        var request = new PutObjectRequest
        {
            BucketName = bucketName,
            Key = $"{ASSET_CONTAINER_FOLDER_NAME}/{folderName}/",
            ContentBody = string.Empty,
        };

        await s3Client.PutObjectAsync(request);
    }
}
