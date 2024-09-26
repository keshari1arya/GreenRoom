using GreenRoom.Application.Common.Interfaces;
using GreenRoom.Application.Tenants.Queries.GetTenants;
using GreenRoom.Application.Tenants.Queries.TenantDetails;

namespace GreenRoom.Application.Tenants.Queries.GetCurrentTenant;

public record GetCurrentTenantQuery : IRequest<TenantDto>
{
}

public class GetCurrentTenantQueryValidator : AbstractValidator<GetCurrentTenantQuery>
{
    public GetCurrentTenantQueryValidator()
    {
    }
}

public class GetCurrentTenantQueryHandler : IRequestHandler<GetCurrentTenantQuery, TenantDto>
{
    private readonly ISender _sender;
    private readonly IMultiTenancyService _multiTenancyService;

    public GetCurrentTenantQueryHandler(ISender sender, IMultiTenancyService multiTenancyService)
    {
        _sender = sender;
        _multiTenancyService = multiTenancyService;
    }

    public Task<TenantDto> Handle(GetCurrentTenantQuery request, CancellationToken cancellationToken)
    {
        return _sender.Send(new TenantDetailsQuery(_multiTenancyService.CurrentTenant), cancellationToken);
    }
}
