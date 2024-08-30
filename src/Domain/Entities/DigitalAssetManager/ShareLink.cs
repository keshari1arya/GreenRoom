namespace GreenRoom.Domain.Entities.DigitalAssetManager;

public class ShareLink : BaseAuditableEntityWithMultiTenancy
{
    public string? Url { get; set; }
    public string? Token { get; set; }
    public int? AssetId { get; set; }
    public int? FolderId { get; set; }
    public DateTimeOffset ExpiresAt { get; set; }

    public Asset? Asset { get; set; }
    public Folder? Folder { get; set; }
}
