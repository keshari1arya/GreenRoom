namespace GreenRoom.Domain.Entities.DigitalAssetManager;

public class Subscription : BaseAuditableEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public bool IsActive { get; set; }

    // TODO: This is a placeholder for the Stripe Product ID. Need to figure out how to handle this.
    public string? StripeProductId { get; set; }
    public ICollection<TenantSubscription> TenantSubscriptions { get; set; } = new List<TenantSubscription>();
}
