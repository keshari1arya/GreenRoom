namespace GreenRoom.Domain.Common;

public abstract class BaseAuditableEntityWithMultiTenancy : BaseAuditableEntity
{
    public string TenantId { get; set; } = string.Empty;
}
