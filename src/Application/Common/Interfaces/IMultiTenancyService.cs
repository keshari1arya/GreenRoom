namespace GreenRoom.Application.Common.Interfaces;

public interface IMultiTenancyService
{
    string CurrentTenant { get; }
    void SetCurrentTenant(string tenant);
}
