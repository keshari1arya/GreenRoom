import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { PreSignedUrlDto } from "src/app/lib/openapi-generated/models";
import {
  AssetsService,
  StorageManagementsService,
} from "src/app/lib/openapi-generated/services";
import { RootReducerState } from "src/app/store";
import { fetchAssetsByFolderIdData } from "../store/file-manager.actions";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class FileManagementService {
  constructor(
    private storageManagementService: StorageManagementsService,
    private assetService: AssetsService,
    private http: HttpClient,
    private store: Store<{ data: RootReducerState }>
  ) {}

  // This method will be used to download the file
  downloadFile(data: any, filename: string) {
    const blob = new Blob([data], { type: "application/octet-stream" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  }

  // This method will be used to upload the file
  uploadFile(file: File, folderId: number) {
    this.generatePresignedUrl(file, folderId).subscribe((res) => {
      //
      if (environment.production) {
        throw new Error(
          "Please remove below line of making request http instead of https"
        );
      }
      // const url = res.url.slice().replace("https://", "http://");
      const url = res.url;

      // TODO: For large file upload, it will take a lot of time to upload the file. We need to hide the loader after showing a message to the user that the file is being uploaded in the background.

      this.http.put(url, file).subscribe((response) => {
        console.log("File uploaded successfully", response);
        this.assetService
          .createAsset({
            body: {
              contentType: file.type,
              name: file.name,
              folderId: folderId,
              size: file.size,
              url: res.url,
            },
          })
          .subscribe((res) => {
            this.store.dispatch(fetchAssetsByFolderIdData({ folderId }));
            console.log("Asset created successfully", res);
          });
      });
    });
  }

  private generatePresignedUrl(
    file: File,
    folderId: number
  ): Observable<PreSignedUrlDto> {
    const expiryInSeconds = Math.floor(file.size / 102400) + 10;
    const contentType = file.type;
    const fileName = file.name;
    const body = {};
    return this.storageManagementService.generateUrlToUploadFile({
      body: {
        folderId: folderId,
        fileName: fileName,
        contentType: contentType ?? "application/octet-stream",
        expiryInSeconds,
      },
    });
  }
}
