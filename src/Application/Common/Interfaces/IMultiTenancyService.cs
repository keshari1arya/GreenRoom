namespace GreenRoom.Application.Common.Interfaces;

public interface IMultiTenancyService
{
    int CurrentTenant { get; }
    void SetCurrentTenant(int tenantId);
}
