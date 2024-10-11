using GreenRoom.Application.Common.Interfaces;

namespace GreenRoom.Infrastructure.Identity;

public class MultiTenancyService : IMultiTenancyService
{
    private Guid _tenantId;

    public Guid CurrentTenantId
    {
        get => _tenantId;
        private set
        {
            if (_tenantId != value)
            {
                var oldTenant = _tenantId;
                _tenantId = value;
            }
        }
    }

    public void SetCurrentTenant(Guid tenant)
    {
        CurrentTenantId = tenant;
    }
}
