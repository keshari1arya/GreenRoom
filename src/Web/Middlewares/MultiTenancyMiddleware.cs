
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
        var user = context.User;
        if (user.HasClaim(c => c.Type == "tenant"))
        {
            var tenant = user.FindFirst(c => c.Type == "tenant")?.Value;
            _multiTenancyService.SetCurrentTenant(tenant!);
        }
        return next(context);
    }
}
