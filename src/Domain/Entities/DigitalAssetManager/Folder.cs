namespace GreenRoom.Domain.Entities.DigitalAssetManager;

public class Folder : BaseAuditableEntityWithMultiTenancy
{
    public string? Name { get; set; }
    public string? Path { get; set; }
    public string? Thumbnail { get; set; }
    public bool IsTrashed { get; set; }
    public int? ParentId { get; set; } // null for root
    public Folder? Parent { get; set; }
    public ICollection<Folder>? Children { get; set; }
    public ICollection<Asset>? Assets { get; set; }
    public ICollection<FolderTag> FolderTags { get; set; } = [];
}
