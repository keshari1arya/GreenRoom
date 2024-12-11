using GreenRoom.Domain.Entities.DigitalAssetManager;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GreenRoom.Infrastructure.Data.Configurations.DigitalAssetManager;

public class SubscriptionConfiguration : IEntityTypeConfiguration<Subscription>
{
    public void Configure(EntityTypeBuilder<Subscription> builder)
    {
        builder.Property(t => t.Name)
           .IsRequired();

        builder
            .Property(b => b.Description)
            .IsRequired();

        builder
            .Property(b => b.Price)
            .HasPrecision(18, 2)
            .IsRequired();

        builder
            .HasIndex(b => b.StripeProductId)
            .IsUnique();
    }
}
