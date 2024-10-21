using GreenRoom.Application.Common.Interfaces;
using GreenRoom.Application.Common.Models;
using GreenRoom.Domain.Entities.DigitalAssetManager;
using Microsoft.AspNetCore.Identity;

namespace GreenRoom.Application.Users.Commands.VerifyUserInvitation;

public record VerifyUserInvitationCommand(string Token) : IRequest<VerifyUserInvitationResponse>;

public class VerifyUserInvitationCommandValidator : AbstractValidator<VerifyUserInvitationCommand>
{
    public VerifyUserInvitationCommandValidator(IApplicationDbContext context)
    {
        RuleFor(v => v.Token)
           .MustAsync(async (token, cancellationToken) =>
           {
               var userInvitation = await context.UserInvitations.FirstOrDefaultAsync(x => x.Token == token, cancellationToken);
               return userInvitation != null;
           }).WithMessage("Invalid token.")
           .MustAsync(async (token, cancellationToken) =>
           {
               var userInvitation = await context.UserInvitations.FirstOrDefaultAsync(x => x.Token == token, cancellationToken);
               return userInvitation!.ExpiryDate > DateTime.UtcNow;
           }).WithMessage("Token has expired.");
    }
}

public class VerifyUserInvitationCommandHandler : IRequestHandler<VerifyUserInvitationCommand, VerifyUserInvitationResponse>
{
    private readonly IApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public VerifyUserInvitationCommandHandler(IApplicationDbContext context, UserManager<ApplicationUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    public async Task<VerifyUserInvitationResponse> Handle(VerifyUserInvitationCommand request, CancellationToken cancellationToken)
    {
        var userInvitation = await _context.UserInvitations
            .OrderByDescending(x => x.ExpiryDate)
            .FirstOrDefaultAsync(x => x.Token == request.Token, cancellationToken: cancellationToken);


        if (userInvitation!.IsAccepted)
        {
            // TODO: Move all magic strings to a separate class
            return new VerifyUserInvitationResponse(false, "User invitation has already been accepted.");
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

            return new VerifyUserInvitationResponse(true, "User invitation accepted successfully.");
        }

        return new VerifyUserInvitationResponse(false, "Failed to accept user invitation.");
    }
}

public record VerifyUserInvitationResponse(bool IsSuccess, string Message);