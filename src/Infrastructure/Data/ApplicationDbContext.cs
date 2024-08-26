using System.Reflection;
using GreenRoom.Application.Common.Interfaces;
using GreenRoom.Domain.Entities;
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

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

        builder
            .Entity<TodoList>()
            .HasQueryFilter(t => t.TenantId == _multiTenancyService.CurrentTenant);
    }

}
