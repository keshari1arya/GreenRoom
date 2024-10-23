using GreenRoom.Domain.Entities.DigitalAssetManager;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GreenRoom.Infrastructure.Data.Configurations.DigitalAssetManager;

public class FolderPinConfiguration : IEntityTypeConfiguration<FolderPin>
{
    public void Configure(EntityTypeBuilder<FolderPin> builder)
    {
        builder
            .HasOne(b => b.Folder)
            .WithMany()
            .HasForeignKey(b => b.FolderId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
