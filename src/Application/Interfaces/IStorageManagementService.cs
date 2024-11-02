namespace GreenRoom.Application.Interfaces;

public interface IStorageManagementService
{
    string GenerateUrlToUpload(string fileName, string contentType, long expiryInSeconds);
    string GenerateUrlToDownload(string fileName, long expiryInSeconds);
    Task CreateBucketAsync(string bucketName);
    Task CreateFolderAsync(string folderName);
    Task<long> GetBucketSizeAsync();
}
