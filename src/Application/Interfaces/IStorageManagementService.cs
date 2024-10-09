namespace GreenRoom.Application.Interfaces;

public interface IStorageManagementService
{
    string GenerateUrlToUpload(string fileName, string contentType, int expiryInSeconds);
    string GenerateUrlToDownload(string fileName, int expiryInSeconds);
}
