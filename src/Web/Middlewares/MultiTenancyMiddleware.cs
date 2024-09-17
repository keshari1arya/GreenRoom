
using GreenRoom.Application.Common.Interfaces;

namespace Web.Middlewares;
public class MultiTenancyMiddleware : IMiddleware
{
    private readonly IMultiTenancyService _multiTenancyService;

    public MultiTenancyMiddleware(IMultiTenancyService multiTenancyService)
    {
        _multiTenancyService = multiTenancyService;
    }

    public Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        if (context.Request.Headers.TryGetValue("X-Tenant-Id", out var tenantId)
            && int.TryParse(tenantId, out var tenant)
            && tenant > 0)
        {
            _multiTenancyService.SetCurrentTenant(tenant);
        }

        return next(context);
    }
}
