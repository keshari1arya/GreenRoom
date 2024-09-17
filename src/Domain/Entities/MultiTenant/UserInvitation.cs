namespace GreenRoom.Domain.Entities.DigitalAssetManager;

public class UserInvitation : BaseAuditableEntityWithMultiTenancy
{
    public string Email { get; set; } = string.Empty;
    public string Token { get; set; } = string.Empty;
    public DateTime ExpiryDate { get; set; }
    public bool IsAccepted { get; set; }
}
