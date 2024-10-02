﻿using System.Reflection;
using GreenRoom.Application.Common.Interfaces;
using GreenRoom.Domain.Entities;
using GreenRoom.Domain.Entities.DigitalAssetManager;
using GreenRoom.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace GreenRoom.Infrastructure.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>, IApplicationDbContext
{
    private readonly IMultiTenancyService _multiTenancyService;
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options, IMultiTenancyService multiTenancyService) : base(options)
    {
        _multiTenancyService = multiTenancyService;
    }

    public DbSet<TodoList> TodoLists => Set<TodoList>();
    public DbSet<TodoItem> TodoItems => Set<TodoItem>();
    public DbSet<Folder> Folders => Set<Folder>();
    public DbSet<Asset> Assets => Set<Asset>();
    public DbSet<ShareLink> ShareLinks => Set<ShareLink>();
    public DbSet<UserInvitation> UserInvitations => Set<UserInvitation>();
    public DbSet<Tenant> Tenants => Set<Tenant>();
    public DbSet<TenantUser> TenantUsers => Set<TenantUser>();
    public DbSet<Subscription> Subscriptions => Set<Subscription>();
    public DbSet<TenantSubscription> TenantSubscriptions => Set<TenantSubscription>();
    public DbSet<TenantRole> TenantRoles => Set<TenantRole>();
    public DbSet<Tag> Tags => Set<Tag>();
    public DbSet<AssetTag> AssetTags => Set<AssetTag>();
    public DbSet<FolderTag> FolderTags => Set<FolderTag>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

        builder
            .Entity<TodoList>()
            .HasQueryFilter(t => t.TenantId == _multiTenancyService.CurrentTenant);

        builder
            .Entity<TodoItem>()
            .HasQueryFilter(t => t.TenantId == _multiTenancyService.CurrentTenant);

        builder
            .Entity<Folder>()
            .HasQueryFilter(t => t.TenantId == _multiTenancyService.CurrentTenant);

        builder
            .Entity<Asset>()
            .HasQueryFilter(t => t.TenantId == _multiTenancyService.CurrentTenant);

        builder
            .Entity<ShareLink>()
            .HasQueryFilter(t => t.TenantId == _multiTenancyService.CurrentTenant);

        builder
            .Entity<UserInvitation>()
            .HasQueryFilter(t => t.TenantId == _multiTenancyService.CurrentTenant);

        builder
            .Entity<Tag>()
            .HasQueryFilter(t => t.TenantId == _multiTenancyService.CurrentTenant);
    }

    DbSet<T> IApplicationDbContext.Set<T>()
    {
        return Set<T>();
    }
}
