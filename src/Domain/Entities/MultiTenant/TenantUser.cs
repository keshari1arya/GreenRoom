namespace GreenRoom.Domain.Entities.DigitalAssetManager;

public class TenantUser : BaseAuditableEntityWithMultiTenancy
{
    public string UserId { get; set; } = string.Empty;
    public int TenantRoleId { get; set; }
    public TenantRole TenantRole { get; set; } = null!;
}
