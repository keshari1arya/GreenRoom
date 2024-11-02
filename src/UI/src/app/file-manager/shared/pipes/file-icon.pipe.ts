import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "fileIcon",
})
export class FileIconPipe implements PipeTransform {
  transform(name: string): string {
    const extension = name.split(".").pop();
    const icons = {
      html: "mdi mdi-file-document",
      txt: "mdi mdi-text-box",
      png: "mdi mdi-image text-success",
      jpeg: "mdi mdi-image text-muted",
      zip: "mdi mdi-folder-zip text-warning",
      folder: "mdi mdi-folder text-warning",
      pdf: "mdi mdi-file-pdf",
      doc: "mdi mdi-file-word",
      docx: "mdi mdi-file-word",
      xls: "mdi mdi-file-excel",
      xlsx: "mdi mdi-file-excel",
      ppt: "mdi mdi-file-powerpoint",
      pptx: "mdi mdi-file-powerpoint",
    };

    return icons[extension.toLowerCase()] || "bx bxs-file";
  }
}
