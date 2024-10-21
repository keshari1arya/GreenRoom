namespace Application.Templates;

public class EmailTemplates
{
    public static string InviteUserTemplate(string inviteUrl, string invitedBy)
    {
        return $@"
            <html>
                <body>
                    <p>Hi there!</p>
                    <p>You have been invited to join our platform by {invitedBy} Click the link below to create your account:</p>
                    <a href=""{inviteUrl}"">Create Account</a>

                    <p>Thanks!</p>
                </body>
            </html>
        ";
    }
}