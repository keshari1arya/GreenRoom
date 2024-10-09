using GreenRoom.Domain.Entities.DigitalAssetManager;

namespace GreenRoom.Domain.Common;

public abstract class BaseAuditableEntityWithMultiTenancy : BaseAuditableEntity
{
    public Guid TenantId { get; set; }
}
