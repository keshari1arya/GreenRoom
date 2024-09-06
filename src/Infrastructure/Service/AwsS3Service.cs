using Amazon.S3;
using Amazon.S3.Model;
using GreenRoom.Application.Common.Configurations;
using GreenRoom.Application.Interfaces;
using Microsoft.Extensions.Options;

namespace GreenRoom.Infrastructure.Service;
public class AwsS3Service : IStorageManagementService
{
    private readonly IAmazonS3 _s3Client;
    private readonly AwsS3Settings _settings;

    public AwsS3Service(IAmazonS3 s3Client, IOptions<AwsS3Settings> options)
    {
        _settings = options.Value;
        _s3Client = s3Client;
    }

    public string GenerateUrlToUpload(string bucketName, string fileName, string contentType, int expiryInSeconds)
    {
        var request = new GetPreSignedUrlRequest
        {
            BucketName = _settings.BucketName,
            Key = fileName,
            Verb = HttpVerb.PUT,
            Expires = DateTime.Now.AddSeconds(expiryInSeconds),
            ContentType = contentType
        };

        return _s3Client.GetPreSignedURL(request);
    }
}
