using GreenRoom.Application.Common.Extension;
using GreenRoom.Application.Common.Interfaces;
using GreenRoom.Application.Folders.Queries.GetFolderPathToRoot;
using GreenRoom.Application.Interfaces;

namespace GreenRoom.Application.FileManagements.Commands.GenerateUrlToUploadFile;

public record GenerateUrlToUploadFileCommand(
    int? FolderId,
    string FileName,
    string ContentType,
    int ExpiryInSeconds
) : IRequest<PreSignedUrlDto>;

public class GenerateUrlToUploadFileCommandValidator : AbstractValidator<GenerateUrlToUploadFileCommand>
{
    public GenerateUrlToUploadFileCommandValidator(IApplicationDbContext context)
    {
        RuleFor(v => v.FolderId).IdMustExistIfNotNull(context.Folders);
        RuleFor(v => v.FileName).NotEmpty();
        RuleFor(v => v.ContentType).NotEmpty();
        RuleFor(v => v.ExpiryInSeconds).GreaterThan(0);
    }
}

public class GenerateUrlToUploadFileCommandHandler : IRequestHandler<GenerateUrlToUploadFileCommand, PreSignedUrlDto>
{
    private readonly IStorageManagementService _fileManagementService;
    private readonly ISender _mediator;

    public GenerateUrlToUploadFileCommandHandler(IStorageManagementService fileManagementService, ISender mediator)
    {
        _fileManagementService = fileManagementService;
        _mediator = mediator;
    }

    public async Task<PreSignedUrlDto> Handle(GenerateUrlToUploadFileCommand request, CancellationToken cancellationToken)
    {
        var fileName = request.FileName;
        if (request.FolderId.HasValue)
        {
            var folderPath = await _mediator.Send(new GetFolderPathToRootQuery(request.FolderId!.Value), cancellationToken);
            fileName = $"{string.Join("/", folderPath.Select(x => x.FolderName))}/{fileName}";
        }

        var url = _fileManagementService.GenerateUrlToUpload(fileName, request.ContentType, request.ExpiryInSeconds);
        return await Task.FromResult(new PreSignedUrlDto { Url = url });
    }
}

public class PreSignedUrlDto
{
    public string Url { get; set; } = string.Empty;
}