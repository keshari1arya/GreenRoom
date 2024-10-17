using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Amazon.Runtime;
using GreenRoom.Application.Common.Interfaces;

namespace GreenRoom.Infrastructure.Service;

public class NotificationService : INotificationService
{
    private readonly HttpClient _client;

    public NotificationService(HttpClient client)
    {
        _client = client;
    }

    public async void SendEmail(string email, string subject, string message)
    {
        var payload = new
        {
            sender = new { email = "trial-pxkjn4100d5gz781.mlsender.net", name = "GreenRoom" },
            to = new[] { new { email, name = "some name" } },
            subject,
            htmlContent = message
        };
        var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
        var response = await _client.PostAsync("", content, default);
    }
}
