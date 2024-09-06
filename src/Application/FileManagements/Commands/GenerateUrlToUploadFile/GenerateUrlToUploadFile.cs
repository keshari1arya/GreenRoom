using GreenRoom.Application.Interfaces;

namespace GreenRoom.Application.FileManagements.Commands.GenerateUrlToUploadFile;

public record GenerateUrlToUploadFileCommand(
    string FileName,
    string ContentType,
    int ExpiryInSeconds
) : IRequest<string>;

public class GenerateUrlToUploadFileCommandValidator : AbstractValidator<GenerateUrlToUploadFileCommand>
{
    public GenerateUrlToUploadFileCommandValidator()
    {
        RuleFor(v => v.FileName).NotEmpty();
        RuleFor(v => v.ContentType).NotEmpty();
        RuleFor(v => v.ExpiryInSeconds).GreaterThan(0);
    }
}

public class GenerateUrlToUploadFileCommandHandler : IRequestHandler<GenerateUrlToUploadFileCommand, string>
{
    private readonly IStorageManagementService _fileManagementService;

    public GenerateUrlToUploadFileCommandHandler(IStorageManagementService fileManagementService)
    {
        _fileManagementService = fileManagementService;
    }

    public async Task<string> Handle(GenerateUrlToUploadFileCommand request, CancellationToken cancellationToken)
    {
        var bucketName = "bucketName";
        return await Task.FromResult(_fileManagementService.GenerateUrlToUpload(bucketName, request.FileName!, request.ContentType!, request.ExpiryInSeconds));
    }
}
