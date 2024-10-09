namespace GreenRoom.Application.Common.Interfaces;

public interface IMultiTenancyService
{
    Guid CurrentTenantId { get; }
    void SetCurrentTenant(Guid tenantId);
}
