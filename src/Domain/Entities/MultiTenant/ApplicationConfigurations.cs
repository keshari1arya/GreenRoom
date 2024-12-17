namespace GreenRoom.Domain.Entities.DigitalAssetManager;

public class ApplicationConfigurations : BaseEntity
{
    public string? Key { get; set; }
    public string? Value { get; set; }
    public string? Description { get; set; }
    public string? Type { get; set; }
}
