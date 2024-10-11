using GreenRoom.Application.Interfaces;

namespace GreenRoom.Application.FileManagements.Commands.GenerateUrlToUploadFile;

public record GenerateUrlToUploadFileCommand(
    string FileName,
    string ContentType,
    int ExpiryInSeconds
) : IRequest<PreSignedUrlDto>;

public class GenerateUrlToUploadFileCommandValidator : AbstractValidator<GenerateUrlToUploadFileCommand>
{
    public GenerateUrlToUploadFileCommandValidator()
    {
        RuleFor(v => v.FileName).NotEmpty();
        RuleFor(v => v.ContentType).NotEmpty();
        RuleFor(v => v.ExpiryInSeconds).GreaterThan(0);
    }
}

public class GenerateUrlToUploadFileCommandHandler : IRequestHandler<GenerateUrlToUploadFileCommand, PreSignedUrlDto>
{
    private readonly IStorageManagementService _fileManagementService;

    public GenerateUrlToUploadFileCommandHandler(IStorageManagementService fileManagementService)
    {
        _fileManagementService = fileManagementService;
    }

    public async Task<PreSignedUrlDto> Handle(GenerateUrlToUploadFileCommand request, CancellationToken cancellationToken)
    {
        var url = _fileManagementService.GenerateUrlToUpload(request.FileName, request.ContentType, request.ExpiryInSeconds);
        return await Task.FromResult(new PreSignedUrlDto { Url = url });
    }
}

public class PreSignedUrlDto
{
    public string Url { get; set; } = string.Empty;
}