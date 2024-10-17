using System.Net.Mail;
using GreenRoom.Application.Common.Interfaces;

namespace GreenRoom.Infrastructure.Service;

public class NotificationService : INotificationService
{
    private readonly SmtpClient _client;

    public NotificationService(SmtpClient client)
    {
        _client = client;
    }

    public void SendEmail(string email, string subject, string message)
    {
        var mail = new MailMessage()
        {
            // TODO: Move to configuration or use api to send email
            From = new MailAddress("bloggerrejo@gmail.com", "GreenRoom"),
            To = { email },
            Subject = subject,
            Body = message,
            IsBodyHtml = true
        };

        _client.Send(mail);
    }
}
