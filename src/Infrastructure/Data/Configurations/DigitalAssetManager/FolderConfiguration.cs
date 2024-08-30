using GreenRoom.Domain.Entities.DigitalAssetManager;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GreenRoom.Infrastructure.Data.Configurations.DigitalAssetManager;

public class FolderConfiguration : IEntityTypeConfiguration<Folder>
{
    public void Configure(EntityTypeBuilder<Folder> builder)
    {
        builder
            .Property(b => b.Name)
            .IsRequired();

        builder
            .Property(b => b.Path)
            .IsRequired();

        builder
            .HasMany(b => b.Assets)
            .WithOne(b => b.Folder)
            .HasForeignKey(b => b.FolderId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
