using GreenRoom.Application.Common.Extension;
using GreenRoom.Application.Common.Interfaces;
using GreenRoom.Domain.Entities.DigitalAssetManager;

namespace GreenRoom.Application.Assets.Commands.CreateAsset;

public record CreateAssetCommand(
    string Name,
    string Url,
    int SizeInKB,
    string ContentType,
    int? FolderId
) : IRequest<int>;

public class CreateAssetCommandValidator : AbstractValidator<CreateAssetCommand>
{
    public CreateAssetCommandValidator(IApplicationDbContext context)
    {
        RuleFor(v => v.Name)
            .NotEmpty();

        RuleFor(v => v.Url)
            .NotEmpty();

        RuleFor(v => v.SizeInKB)
            .GreaterThan(0)
            .NotEmpty();

        RuleFor(v => v.ContentType)
            .NotEmpty();

        RuleFor(v => v.FolderId)
            .IdMustExistIfNotNull(context.Folders);
    }
}

public class CreateAssetCommandHandler(IApplicationDbContext context) : IRequestHandler<CreateAssetCommand, int>
{
    public async Task<int> Handle(CreateAssetCommand request, CancellationToken cancellationToken)
    {
        var uri = new Uri(request.Url);
        var segments = uri.AbsolutePath.Split('/');
        var path = string.Join("/", segments.Skip(2));
        var entity = new Asset
        {
            Name = request.Name,
            Path = request.Name,
            SizeInKB = request.SizeInKB,
            ContentType = request.ContentType,
            FolderId = request.FolderId,
            Type = this.GetFileType(path)
        };

        context.Assets.Add(entity);

        await context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }

    private string GetFileType(string path)
    {
        // TODO: Remove these hardcoded extensions and move them to the database
        var extension = Path.GetExtension(path);
        string[] videoExtensions = [".mp4", ".avi", ".mkv", ".webm", ".flv", ".mov", ".wmv", ".mpg", ".mpeg", ".3gp", ".3g2", ".m4v", ".h264", ".rm", ".swf", ".vob", ".ogv", ".ogg", ".qt", ".f4v", ".asf", ".m2ts", ".ts", ".m2v", ".m4p", ".m4v", ".mpg", ".mpeg", ".mpv", ".mp2", ".mpe", ".mpv2", ".m2p", ".mp2v", ".m2t", ".m2ts", ".mts", ".m2v", ".m2a", ".m2pa"];
        string[] imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff", ".psd", ".ai", ".eps", ".svg", ".svgz", ".tga", ".tif", ".jfif", ".ico", ".webp", ".avif", ".apng", ".jfif", ".pjpeg", ".pjp", ".jpe", ".jfif-tbnl", ".jfi", ".jif", ".jpf", ".jpx", ".jpm", ".jp2", ".j2k", ".j2c", ".jpc", ".jps", ".jpe", ".jpm", ".jpf", ".jpx", ".j2c", ".j2k", ".j2x", ".j2z", ".jxr", ".jxl", ".jls", ".jpm", ".jph", ".jpe", ".jpf", ".jpx", ".j2c", ".j2k", ".j2x", ".j2z", ".jxr", ".jxl", ".jls", ".jpm", ".jph", ".jpe", ".jpf", ".jpx", ".j2c", ".j2k", ".j2x", ".j2z", ".jxr", ".jxl", ".jls", ".jpm", ".jph", ".jpe", ".jpf", ".jpx", ".j2c", ".j2k", ".j2x", ".j2z", ".jxr", ".jxl", ".jls", ".jpm", ".jph", ".jpe", ".jpf", ".jpx", ".j2c", ".j2k", ".j2x", ".j2z", ".jxr", ".jxl", ".jls", ".jpm", ".jph", ".jpe", ".jpf", ".jpx", ".j2c", ".j2k", ".j2x", ".j2z", ".jxr", ".jxl", ".jls", ".jpm", ".jph", ".jpe", ".jpf", ".jpx", ".j2c", ".j2k", ".j2x", ".j2z", ".jxr", ".jxl", ".jls", ".jpm"];
        string[] audioExtensions = [".mp3", ".wav", ".wma", ".aac", ".flac", ".m4a", ".m4b", ".m4p", ".m4r", ".m4v", ".3ga", ".aa", ".aax", ".act", ".aiff", ".alac", ".amr", ".ape", ".au", ".awb", ".dct", ".dss", ".dvf", ".flac", ".gsm", ".iklax", ".ivs", ".m4p", ".mmf", ".mpc", ".msv", ".nmf", ".nsf", ".ogg", ".oga", ".mogg", ".opus", ".ra", ".rm", ".raw", ".sln", ".tta", ".vox", ".wav", ".wma", ".wv", ".webm", ".8svx", ".cda", ".mid", ".midi", ".mka", ".mpa", ".rmi", ".snd", ".voc", ".w64", ".wv", ".webm", ".8svx", ".cda", ".mid", ".midi", ".mka", ".mpa", ".rmi", ".snd", ".voc", ".w64", ".wv", ".webm", ".8svx", ".cda", ".mid", ".midi", ".mka", ".mpa", ".rmi", ".snd", ".voc", ".w64", ".wv", ".webm", ".8svx", ".cda", ".mid", ".midi", ".mka", ".mpa", ".rmi", ".snd", ".voc", ".w64", ".wv", ".webm", ".8svx", ".cda", ".mid", ".midi", ".mka", ".mpa", ".rmi", ".snd", ".voc", ".w64", ".wv", ".webm", ".8svx", ".cda", ".mid", ".midi", ".mka", ".mpa", ".rmi", ".snd", ".voc", ".w64", ".wv", ".webm", ".8svx", ".cda", ".mid", ".midi", ".mka", ".mpa", ".rmi", ".snd", ".voc"];
        string[] textDocumentExtensions = [".txt", ".doc", ".docx", ".pdf", ".odt", ".rtf", ".tex", ".wks", ".wps", ".wpd", ".ods", ".xls", ".xlsx", ".ppt", ".pptx", ".odp", ".csv", ".xml", ".html", ".htm", ".xhtml", ".php", ".c", ".cpp", ".h", ".hpp", ".cs", ".java", ".py", ".js", ".ts", ".css", ".scss", ".sass", ".less", ".json", ".yaml", ".yml", ".xml", ".sql", ".pl", ".rb", ".go", ".swift", ".kt", ".kts"];

        if (videoExtensions.Contains(extension))
        {
            return "video";
        }

        if (imageExtensions.Contains(extension))
        {
            return "image";
        }

        if (audioExtensions.Contains(extension))
        {
            return "audio";
        }

        if (textDocumentExtensions.Contains(extension))
        {
            return "text";
        }

        return "other";
    }
}
