using Amazon.S3;
using Amazon.S3.Model;
using GreenRoom.Application.Common.Interfaces;
using GreenRoom.Domain.Entities.DigitalAssetManager;

namespace GreenRoom.Application.Tenants.Commands.CreateTenant;

public record CreateTenantCommand(
    string Name,
    string? Description
) : IRequest<Guid>;

public class CreateTenantCommandValidator : AbstractValidator<CreateTenantCommand>
{
    public CreateTenantCommandValidator(IApplicationDbContext context)
    {
        RuleFor(v => v.Name)
            .MaximumLength(200)

           // TODO: Make a generic method for this validation in ValidationExtensions
           .MustAsync(async (name, cancellationToken) =>
              {
                  return !await context.Tenants.AsNoTracking().AnyAsync(x => x.Name == name, cancellationToken);
              })
              .WithMessage("{PropertyName}: {PropertyValue} already exists.")
            .NotEmpty();

        RuleFor(v => v.Description)
            .MaximumLength(200);
    }
}

public class CreateTenantCommandHandler(IApplicationDbContext context, IUser user, IAmazonS3 s3Client) : IRequestHandler<CreateTenantCommand, Guid>
{
    public async Task<Guid> Handle(CreateTenantCommand request, CancellationToken cancellationToken)
    {
        var entity = new Tenant
        {
            Name = request.Name,
            Description = request.Description,
            IsActive = true,
            TenantUsers = [
                new() {
                    UserId = user.Id!,
                    // TODO: Assign Admin role dynamically and remove hardcoding
                    TenantRoleId = 1
                }
            ]
        };

        context.Tenants.Add(entity);

        await context.SaveChangesAsync(cancellationToken);


        // TODO: Set permissions for the bucket based on the tenant's requirements
        _ = await s3Client.PutBucketAsync(
            new PutBucketRequest()
            {
                BucketName = entity.Id.ToString(),
                UseClientRegion = true
            }, cancellationToken);

        return entity.Id;
    }
}
