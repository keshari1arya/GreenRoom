using Application.Templates;
using GreenRoom.Application.Common.Configurations;
using GreenRoom.Application.Common.Interfaces;
using GreenRoom.Application.Common.Models;
using GreenRoom.Application.Common.Security;
using GreenRoom.Domain.Entities.DigitalAssetManager;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;

namespace GreenRoom.Application.Users.Commands.InviteUser;

public record InviteUserCommand(string Email) : IRequest;

public class InviteUserCommandValidator : AbstractValidator<InviteUserCommand>
{
    public InviteUserCommandValidator(UserManager<ApplicationUser> userManager)
    {
        RuleFor(v => v.Email)
            .MustAsync(async (email, cancellationToken) =>
            {
                var user = await userManager.FindByEmailAsync(email);
                return user == null;
            }).WithMessage("User with this email already exists.");
    }
}

public class InviteUserCommandHandler : IRequestHandler<InviteUserCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly IMultiTenancyService _multiTenancyService;
    private readonly INotificationService _notificationService;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IUser _user;
    private readonly IOptions<UiSettings> _uiSettings;

    public InviteUserCommandHandler(IApplicationDbContext context, IMultiTenancyService multiTenancyService, INotificationService notificationService, IUser user, UserManager<ApplicationUser> userManager, IOptions<UiSettings> uiSettings)
    {
        _context = context;
        _multiTenancyService = multiTenancyService;
        _notificationService = notificationService;
        _user = user;
        _userManager = userManager;
        _uiSettings = uiSettings;
    }

    public async Task Handle(InviteUserCommand request, CancellationToken cancellationToken)
    {
        var userInvitation = new UserInvitation
        {
            Email = request.Email,
            TenantId = _multiTenancyService.CurrentTenantId,
            Token = Guid.NewGuid().ToString(),
            ExpiryDate = DateTime.UtcNow.AddDays(7)
        };

        _context.UserInvitations.Add(userInvitation);
        await _context.SaveChangesAsync(cancellationToken);

        // TODO: Move email compose logic to a separate service

        var currentUser = await _userManager.FindByIdAsync(_user.Id!);

        var subject = "You have been invited to join GreenRoom";
        var inviteUrl = $"{_uiSettings.Value.BaseUrl}/auth/verify-user-invitation?&token={userInvitation.Token}";

        var message = EmailTemplates.InviteUserTemplate(inviteUrl, $"{currentUser!.FirstName} {currentUser.LastName}");

        _notificationService.SendEmail(request.Email, subject, message);
    }
}
