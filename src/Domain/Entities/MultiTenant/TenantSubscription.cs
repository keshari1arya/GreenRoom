namespace GreenRoom.Domain.Entities.DigitalAssetManager;

public class TenantSubscription : BaseAuditableEntity
{
    public int TenantId { get; set; }
    public Tenant Tenant { get; set; } = null!;
    public int SubscriptionId { get; set; }
    public Subscription Subscription { get; set; } = null!;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int PaymentId { get; set; }
    public ICollection<Tenant> Tenants { get; set; } = new List<Tenant>();
}
