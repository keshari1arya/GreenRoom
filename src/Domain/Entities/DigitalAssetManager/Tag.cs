namespace GreenRoom.Domain.Entities.DigitalAssetManager;

public class Tag : BaseAuditableEntityWithMultiTenancy
{
    public string? Name { get; set; }
    public ICollection<AssetTag> AssetTags { get; set; } = Enumerable.Empty<AssetTag>().ToList();
    public ICollection<FolderTag> FolderTags { get; set; } = Enumerable.Empty<FolderTag>().ToList();
}
