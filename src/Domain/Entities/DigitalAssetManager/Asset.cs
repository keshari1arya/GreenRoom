namespace GreenRoom.Domain.Entities.DigitalAssetManager;

public class Asset : BaseAuditableEntityWithMultiTenancy
{
    public string? Name { get; set; }

    /// <summary>
    /// Size of the file in bytes.
    /// </summary>
    public long Size { get; set; }
    public string? Path { get; set; }
    public string? ContentType { get; set; }
    public bool IsTrashed { get; set; }
    public string? Type { get; set; }
    public int? FolderId { get; set; }
    public Folder? Folder { get; set; }
    public ICollection<AssetTag> AssetTags { get; set; } = [];
}
