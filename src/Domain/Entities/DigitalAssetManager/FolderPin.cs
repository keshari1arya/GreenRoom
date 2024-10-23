namespace GreenRoom.Domain.Entities.DigitalAssetManager;

public class FolderPin : BaseAuditableEntityWithMultiTenancy
{
    public int FolderId { get; set; }
    public Folder Folder { get; set; } = null!;
    public string UserId { get; set; } = null!;
}
