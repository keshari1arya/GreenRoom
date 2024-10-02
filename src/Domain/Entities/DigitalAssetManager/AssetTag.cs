namespace GreenRoom.Domain.Entities.DigitalAssetManager;

public class AssetTag : BaseAuditableEntityWithMultiTenancy
{
    public int AssetId { get; set; }
    public Asset? Asset { get; set; }
    public int TagId { get; set; }
    public Tag? Tag { get; set; }
}
