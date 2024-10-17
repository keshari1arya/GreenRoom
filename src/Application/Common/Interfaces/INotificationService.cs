namespace GreenRoom.Application.Common.Interfaces;

public interface INotificationService
{
    void SendEmail(string email, string subject, string message);
}
