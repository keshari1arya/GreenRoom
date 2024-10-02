using GreenRoom.Domain.Entities.DigitalAssetManager;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GreenRoom.Infrastructure.Data.Configurations.DigitalAssetManager;

public class TagConfiguration : IEntityTypeConfiguration<Tag>
{
    public void Configure(EntityTypeBuilder<Tag> builder)
    {
        builder
            .Property(b => b.Name)
            .IsRequired();

        builder
            .HasMany(b => b.AssetTags)
            .WithOne(b => b.Tag)
            .HasForeignKey(b => b.TagId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasMany(b => b.FolderTags)
            .WithOne(b => b.Tag)
            .HasForeignKey(b => b.TagId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
