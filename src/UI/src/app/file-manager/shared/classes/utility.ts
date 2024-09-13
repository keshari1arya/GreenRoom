import { Injectable } from "@angular/core";

@Injectable()
export class Utility {
  getIconByExtension(name: string): string {
    const extension = name.split(".").pop();
    const icons = {
      html: "mdi mdi-file-document",
      txt: "mdi mdi-text-box text-muted",
      png: "mdi mdi-image text-success",
      jpeg: "mdi mdi-image text-muted",
      zip: "mdi mdi-folder-zip text-warning",
      folder: "mdi mdi-folder text-warning",
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
