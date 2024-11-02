import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "fileSize",
})
export class FileSizePipe implements PipeTransform {
  transform(sizeInBytes: number): string {
    if (sizeInBytes < 1024) {
      return `${sizeInBytes} Bytes`;
    }

    if (sizeInBytes >= 1024 && sizeInBytes < 1048576) {
      return `${(sizeInBytes / 1024).toFixed(2)} KB`;
    }

    if (sizeInBytes >= 1048576 && sizeInBytes < 1073741824) {
      return `${(sizeInBytes / 1048576).toFixed(2)} MB`;
    }

    return `${(sizeInBytes / 1073741824).toFixed(2)} GB`;
  }
}
