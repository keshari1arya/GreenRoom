namespace GreenRoom.Application.Interfaces;

public interface IStorageManagementService
{
    string GenerateUrlToUpload(string bucketName, string fileName, string contentType, int expiryInSeconds);
}
