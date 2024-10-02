using GreenRoom.Domain.Entities.DigitalAssetManager;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GreenRoom.Infrastructure.Data.Configurations.DigitalAssetManager;

public class AssetConfiguration : IEntityTypeConfiguration<Asset>
{
    public void Configure(EntityTypeBuilder<Asset> builder)
    {
        builder.Property(t => t.Name)
           .IsRequired();

        builder
            .Property(b => b.Path)
            .IsRequired();

        builder
            .Property(b => b.ContentType)
            .IsRequired();

        builder
            .HasOne(b => b.Folder)
            .WithMany(b => b.Assets)
            .HasForeignKey(b => b.FolderId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasMany(b => b.AssetTags)
            .WithOne(b => b.Asset)
            .HasForeignKey(b => b.AssetId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
