using GreenRoom.Application.Common.Interfaces;

namespace GreenRoom.Application.FileManagements.Queries.GetBucketStorageStatus;

public record GetBucketStorageStatusQuery() : IRequest<IEnumerable<BucketStorageStatusByAssetTypeDto>>;

public class GetBucketStorageStatusQueryValidator : AbstractValidator<GetBucketStorageStatusQuery>
{
    public GetBucketStorageStatusQueryValidator(IApplicationDbContext context)
    {

    }
}

public class GetBucketStorageStatusQueryHandler : IRequestHandler<GetBucketStorageStatusQuery, IEnumerable<BucketStorageStatusByAssetTypeDto>>
{
    private readonly IApplicationDbContext _context;

    public GetBucketStorageStatusQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<BucketStorageStatusByAssetTypeDto>> Handle(GetBucketStorageStatusQuery request, CancellationToken cancellationToken)
    {
        return await _context.Assets.GroupBy(x => x.Type)
                .Select(x => new BucketStorageStatusByAssetTypeDto
                {
                    Type = x.Key,
                    Size = x.Sum(x => x.SizeInKB),
                    Count = x.Count()
                })
                .ToListAsync(cancellationToken);
    }
}
public class BucketStorageStatusByAssetTypeDto
{
    public string? Type { get; set; }
    public long Size { get; set; }
    public int Count { get; set; }
}