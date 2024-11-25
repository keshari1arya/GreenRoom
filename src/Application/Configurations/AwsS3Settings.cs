namespace GreenRoom.Application.Common.Configurations;

public class AwsS3Settings
{
    public string AccessKey { get; set; } = string.Empty;
    public string Secret { get; set; } = string.Empty;
    public string Region { get; set; } = string.Empty;
    public string BucketName { get; set; } = string.Empty;
    public string InstanceUrl { get; set; } = string.Empty;
}
