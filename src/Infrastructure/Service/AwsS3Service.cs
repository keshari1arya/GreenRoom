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
    private readonly IAmazonS3 _s3Client = s3Client;

    private readonly string _bucketName = dbContext.Tenants.Find(multiTenancyService.CurrentTenantId)!.Id.ToString().ToLower();

    public string GenerateUrlToUpload(string filePath, string contentType, int expiryInSeconds)
    {
        var request = new GetPreSignedUrlRequest
        {
            BucketName = _bucketName,
            Key = $"{ASSET_CONTAINER_FOLDER_NAME}/{filePath}",
            Verb = HttpVerb.PUT,
            Expires = DateTime.Now.AddSeconds(expiryInSeconds),
            ContentType = contentType,
        };

        return _s3Client.GetPreSignedURL(request);
    }

    public string GenerateUrlToDownload(string filePath, int expiryInSeconds)
    {
        var request = new GetPreSignedUrlRequest
        {
            BucketName = _bucketName,
            Key = $"{ASSET_CONTAINER_FOLDER_NAME}/{filePath}",
            Verb = HttpVerb.GET,
            Expires = DateTime.Now.AddSeconds(expiryInSeconds),
        };

        return _s3Client.GetPreSignedURL(request);
    }

    public async Task CreateBucketAsync(string bucketName)
    {
        var request = new PutBucketRequest
        {
            BucketName = bucketName,
        };

        await _s3Client.PutBucketAsync(request);
    }

    public async Task CreateFolderAsync(string folderName)
    {
        var request = new PutObjectRequest
        {
            BucketName = _bucketName,
            Key = $"{ASSET_CONTAINER_FOLDER_NAME}/{folderName}/",
            ContentBody = string.Empty,
        };

        await _s3Client.PutObjectAsync(request);
    }
}
