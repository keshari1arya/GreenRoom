namespace GreenRoom.Domain.Entities.DigitalAssetManager;

public class TenantRole : BaseAuditableEntity
{
    // TODO: Add Tenant specific roles
    // public int TenantId { get; set; }
    // public Tenant Tenant { get; set; } = null!;
    public string RoleName { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public ICollection<TenantUser> TenantUsers { get; set; } = new List<TenantUser>();
}
