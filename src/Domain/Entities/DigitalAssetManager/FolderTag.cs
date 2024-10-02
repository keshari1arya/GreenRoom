namespace GreenRoom.Domain.Entities.DigitalAssetManager;

public class FolderTag : BaseAuditableEntityWithMultiTenancy
{
    public int FolderId { get; set; }
    public Folder? Folder { get; set; }
    public int TagId { get; set; }
    public Tag? Tag { get; set; }
}
