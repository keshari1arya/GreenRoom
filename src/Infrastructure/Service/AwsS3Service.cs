using Amazon.S3;
using Amazon.S3.Model;
using GreenRoom.Application.Common.Interfaces;
using GreenRoom.Application.Interfaces;

namespace GreenRoom.Infrastructure.Service;
public class AwsS3Service : IStorageManagementService
{
    private const string ASSET_CONTAINER_FOLDER_NAME = "AssetContainer";
    private readonly IAmazonS3 _s3Client;

    private readonly string? _bucketName;

    public AwsS3Service(
        IAmazonS3 s3Client,
        IApplicationDbContext dbContext,
        IMultiTenancyService multiTenancyService
    )
    {
        _s3Client = s3Client;
        _bucketName = dbContext.Tenants.Find(multiTenancyService.CurrentTenantId)?.Id.ToString().ToLower();

        if (_bucketName != null)
        {
            CreateBucketIfNotExistsAsync().Wait();
        }
    }

    public string GenerateUrlToUpload(string filePath, string contentType, long expiryInSeconds)
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

    public string GenerateUrlToDownload(string filePath, long expiryInSeconds)
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

    public async Task CreateBucketAsync(string? bucketName)
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


    public async Task<long> GetBucketSizeAsync()
    {
        var request = new ListObjectsV2Request
        {
            BucketName = _bucketName,
        };

        var response = await _s3Client.ListObjectsV2Async(request);

        var totalSize = response.S3Objects.Sum(x => x.Size);
        return totalSize;
    }

    private async Task CreateBucketIfNotExistsAsync()
    {
        var request = new ListBucketsRequest();
        var response = await _s3Client.ListBucketsAsync(request);

        if (response.Buckets.All(x => x.BucketName != _bucketName))
        {
            await CreateBucketAsync(_bucketName);
        }
    }
}