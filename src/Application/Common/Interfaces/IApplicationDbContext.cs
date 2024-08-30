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

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
    DbSet<T> Set<T>() where T : BaseEntity;
}
