using GreenRoom.Application.Common.Interfaces;
using GreenRoom.Application.Interfaces;

namespace GreenRoom.Application.FileManagements.Queries.GetBucketSize;

public record GetBucketSizeQuery : IRequest<long>
{
}

public class GetBucketSizeQueryValidator : AbstractValidator<GetBucketSizeQuery>
{
    public GetBucketSizeQueryValidator()
    {
    }
}

public class GetBucketSizeQueryHandler : IRequestHandler<GetBucketSizeQuery, long>
{
    private readonly IApplicationDbContext _context;
    private readonly IStorageManagementService _storageManagementService;

    public GetBucketSizeQueryHandler(IApplicationDbContext context, IStorageManagementService storageManagementService)
    {
        _context = context;
        _storageManagementService = storageManagementService;
    }

    public async Task<long> Handle(GetBucketSizeQuery request, CancellationToken cancellationToken)
    {
        return await _context.Assets.SumAsync(x => x.SizeInKB, cancellationToken: cancellationToken);
        // return await _storageManagementService.GetBucketSizeAsync();
    }
}
