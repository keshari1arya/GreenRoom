using GreenRoom.Domain.Entities.DigitalAssetManager;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GreenRoom.Infrastructure.Data.Configurations.DigitalAssetManager;

public class TenantSubscriptionConfiguration : IEntityTypeConfiguration<TenantSubscription>
{
    public void Configure(EntityTypeBuilder<TenantSubscription> builder)
    {
        builder
            .HasOne(b => b.Tenant)
            .WithMany(b => b.TenantSubscriptions)
            .HasForeignKey(b => b.TenantId)
            .OnDelete(DeleteBehavior.ClientSetNull);

        builder
            .HasOne(b => b.Subscription)
            .WithMany(b => b.TenantSubscriptions)
            .HasForeignKey(b => b.SubscriptionId)
            .OnDelete(DeleteBehavior.ClientSetNull);
    }
}
