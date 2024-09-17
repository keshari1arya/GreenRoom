using GreenRoom.Application.Common.Interfaces;

namespace GreenRoom.Infrastructure.Identity;

public class MultiTenancyService : IMultiTenancyService
{
    private int _tenant;

    public int CurrentTenant
    {
        get => _tenant;
        private set
        {
            if (_tenant != value)
            {
                var oldTenant = _tenant;
                _tenant = value;
            }
        }
    }

    public void SetCurrentTenant(int tenant)
    {
        CurrentTenant = tenant;
    }
}
