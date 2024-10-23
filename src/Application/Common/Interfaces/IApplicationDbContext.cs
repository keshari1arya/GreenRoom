using GreenRoom.Domain.Common;
using GreenRoom.Domain.Entities;
using GreenRoom.Domain.Entities.DigitalAssetManager;

namespace GreenRoom.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<TodoList> TodoLists { get; }
    DbSet<TodoItem> TodoItems { get; }
    DbSet<Folder> Folders { get; }
    DbSet<Asset> Assets { get; }
    DbSet<ShareLink> ShareLinks { get; }
    DbSet<UserInvitation> UserInvitations { get; }
    DbSet<Tenant> Tenants { get; }
    DbSet<TenantUser> TenantUsers { get; }
    DbSet<Subscription> Subscriptions { get; }
    DbSet<TenantSubscription> TenantSubscriptions { get; }
    DbSet<TenantRole> TenantRoles { get; }
    DbSet<Tag> Tags { get; }
    DbSet<AssetTag> AssetTags { get; }
    DbSet<FolderTag> FolderTags { get; }
    DbSet<FolderPin> FolderPins { get; }


    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
    DbSet<T> Set<T>() where T : BaseEntity;
}
