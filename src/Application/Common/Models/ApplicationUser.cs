using Microsoft.AspNetCore.Identity;

namespace GreenRoom.Application.Common.Models;

public class ApplicationUser : IdentityUser
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
}
