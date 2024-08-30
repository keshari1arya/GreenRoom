using GreenRoom.Domain.Entities.DigitalAssetManager;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GreenRoom.Infrastructure.Data.Configurations.DigitalAssetManager;

public class ShareLinkConfiguration : IEntityTypeConfiguration<ShareLink>
{
    public void Configure(EntityTypeBuilder<ShareLink> builder)
    {
        builder
            .Property(b => b.Url)
            .IsRequired();

        builder
            .Property(b => b.ExpiresAt)
            .IsRequired();

        builder
            .Property(b => b.Token)
            .IsRequired();
    }
}
