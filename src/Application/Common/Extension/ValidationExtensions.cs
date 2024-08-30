
using GreenRoom.Application.Common.Interfaces;
using GreenRoom.Domain.Common;

namespace GreenRoom.Application.Common.Extension;

public static class ValidationExtensions
{
    /// <summary>
    /// Validate a nullable int Id must exist in database
    /// </summary>
    public static IRuleBuilderOptions<T, int?> IdMustExistIfNotNull<T, TEntity>(
        this IRuleBuilder<T, int?> ruleBuilder,
        DbSet<TEntity> dbSet) where TEntity : BaseEntity
    {
        return ruleBuilder
        .Must(id => id == null || dbSet.AsNoTracking().Any(x => x.Id == id))
        .WithMessage("'{PropertyName}' {PropertyValue} not found.");
    }

    public static IRuleBuilderOptions<T, int> IdMustExistInDatabase<T, TEntity>(
        this IRuleBuilder<T, int> ruleBuilder,
        DbSet<TEntity> dbSet) where TEntity : BaseEntity
    {
        // TODO: Remove this method and make it more generic (like IdMustExistInDatabase<Folder>)
        return ruleBuilder
        .Must(id => dbSet.AsNoTracking().Any(x => x.Id == id))
        .WithMessage("'{PropertyName}' {PropertyValue} not found.");
    }

    // TODO: Optimize this method and make it more generic (like IdsMustExistInDatabase<Folder>)    
    public static IRuleBuilderOptionsConditions<T, int[]> IdsMustExistInDatabase<T, TEntity>(
        this IRuleBuilder<T, int[]> ruleBuilder,
        DbSet<TEntity> dbSet) where TEntity : BaseEntity
    {
        return ruleBuilder
        .CustomAsync((ids, context, cancellationToken) =>
         {
             // TODO: Optimize this condition
             var notFoundIds = ids.Where(id => !dbSet.AsNoTracking().Any(x => x.Id == id)).ToList();

             if (notFoundIds.Any())
             {
                 context.AddFailure(context.PropertyPath, $"Some {typeof(TEntity).Name} not found with these ids: {string.Join(", ", notFoundIds)}");
             }

             return Task.CompletedTask;
         });
    }
}