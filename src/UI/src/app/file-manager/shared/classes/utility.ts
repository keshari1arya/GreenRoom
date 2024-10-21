import { Injectable } from "@angular/core";

@Injectable()
export class Utility {
  getIconByExtension(name: string): string {
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

  getFileSize(sizeInKB: number): string {
    if (sizeInKB < 1024) {
      return `${sizeInKB} KB`;
    } else if (sizeInKB >= 1024 && sizeInKB < 1048576) {
      return `${(sizeInKB / 1024).toFixed(2)} MB`;
    } else {
      return `${(sizeInKB / 1048576).toFixed(2)} GB`;
    }
  }
}
