using GreenRoom.Application.Common.Interfaces;
using GreenRoom.Application.Common.Models;
using GreenRoom.Application.Common.Security;
using GreenRoom.Domain.Entities.DigitalAssetManager;
using Microsoft.AspNetCore.Identity;

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

    public InviteUserCommandHandler(IApplicationDbContext context, IMultiTenancyService multiTenancyService, INotificationService notificationService)
    {
        _context = context;
        _multiTenancyService = multiTenancyService;
        _notificationService = notificationService;
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

        _notificationService.SendEmail(request.Email, "Invitation", "You have been invited to join GreenRoom. Click here to accept the invitation.");
    }
}
