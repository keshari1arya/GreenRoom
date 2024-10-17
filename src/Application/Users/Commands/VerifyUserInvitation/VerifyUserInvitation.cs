using GreenRoom.Application.Common.Interfaces;
using GreenRoom.Application.Common.Models;
using GreenRoom.Domain.Constants;
using GreenRoom.Domain.Entities.DigitalAssetManager;
using Microsoft.AspNetCore.Identity;

namespace GreenRoom.Application.Users.Commands.VerifyUserInvitation;

public record VerifyUserInvitationCommand(string Email, string Token) : IRequest<string>;

public class VerifyUserInvitationCommandValidator : AbstractValidator<VerifyUserInvitationCommand>
{
    public VerifyUserInvitationCommandValidator(IApplicationDbContext context)
    {
        RuleFor(v => v.Email)
            .MustAsync(async (email, cancellationToken) =>
            {
                var userInvitation = await context.UserInvitations
                    .FirstOrDefaultAsync(x => x.Email == email, cancellationToken: cancellationToken);
                return userInvitation != null;
            }).WithMessage("User invitation not found.");
    }
}

public class VerifyUserInvitationCommandHandler : IRequestHandler<VerifyUserInvitationCommand, string>
{
    private readonly IApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public VerifyUserInvitationCommandHandler(IApplicationDbContext context, UserManager<ApplicationUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    public async Task<string> Handle(VerifyUserInvitationCommand request, CancellationToken cancellationToken)
    {
        var userInvitation = await _context.UserInvitations
            .OrderByDescending(x => x.ExpiryDate)
            .FirstOrDefaultAsync(x => x.Email == request.Email && x.Token == request.Token, cancellationToken: cancellationToken);

        Guard.Against.Null(userInvitation, nameof(userInvitation), "User invitation not found.");

        if (userInvitation.ExpiryDate < DateTime.UtcNow)
        {
            return "User invitation has expired.";
        }

        if (userInvitation.IsAccepted)
        {
            return "User invitation has already been accepted. Please login or reset your password.";
        }

        var user = new ApplicationUser
        {
            Email = userInvitation.Email,
            UserName = userInvitation.Email
        };

        var result = await _userManager.CreateAsync(user);

        if (result.Succeeded)
        {
            userInvitation.IsAccepted = true;

            _context.TenantUsers.Add(new TenantUser
            {
                TenantId = userInvitation.TenantId,
                UserId = user.Id,
                TenantRoleId = 2,
            });
            await _context.SaveChangesAsync(cancellationToken);

            return "User invitation has been accepted.";
        }

        return "User invitation could not be accepted.";
    }
}
