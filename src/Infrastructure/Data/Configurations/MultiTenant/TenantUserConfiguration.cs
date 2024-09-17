using GreenRoom.Domain.Entities.DigitalAssetManager;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GreenRoom.Infrastructure.Data.Configurations.DigitalAssetManager;

public class TenantUserConfiguration : IEntityTypeConfiguration<TenantUser>
{
    public void Configure(EntityTypeBuilder<TenantUser> builder)
    {
        builder.Property(t => t.UserId)
           .IsRequired();

        builder
            .HasOne(b => b.TenantRole)
            .WithMany(b => b.TenantUsers)
            .HasForeignKey(b => b.TenantRoleId)
            .OnDelete(DeleteBehavior.ClientSetNull);
    }
}
