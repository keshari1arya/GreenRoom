namespace GreenRoom.Application.Interfaces;

public interface IStorageManagementService
{
    string GenerateUrlToUpload(string fileName, string contentType, int expiryInSeconds);
    string GenerateUrlToDownload(string fileName, int expiryInSeconds);
    Task CreateBucketAsync(string bucketName);
    Task CreateFolderAsync(string folderName);
}
