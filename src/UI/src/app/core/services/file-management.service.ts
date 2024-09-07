import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {firstValueFrom, Observable, switchMap} from 'rxjs';
import {PreSignedUrlDto} from 'src/app/lib/openapi-generated/models';
import {AssetsService, StorageManagementsService} from 'src/app/lib/openapi-generated/services';

@Injectable({
  providedIn: 'root',
})
export class FileManagementService {
  constructor(
    private storageManagementService: StorageManagementsService,
    private assetService: AssetsService,
    private http: HttpClient,
  ) {}

  // This method will be used to download the file
  downloadFile(data: any, filename: string) {
    const blob = new Blob([data], {type: 'application/octet-stream'});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  }

  // This method will be used to upload the file
  uploadFile(file: File, folderId: number) {
    this.generatePresignedUrl(file).subscribe((res) => {
      console.log('Generated URL', res);

      // make the request http instead of https
      //   const url = res.url;
      // res.url = res.url.replace('https://', 'http://');
      const url = res.url.slice().replace('https://', 'http://');

      this.http.put(url, file).subscribe((response) => {
        console.log('File uploaded successfully', response);
        this.assetService
          .createAsset({
            body: {
              contentType: file.type,
              name: file.name,
              folderId: folderId,
              sizeInKB: file.size,
              url: res.url,
            },
          })
          .subscribe((res) => {
            console.log('Asset created successfully', res);
          });
      });
    });
  }

  private generatePresignedUrl(file: File): Observable<PreSignedUrlDto> {
    const expiryInSeconds = 60 * 60;
    const contentType = file.type;
    const fileName = file.name;
    const body = {
      fileName: 'aFoldername/' + fileName,
      contentType,
      expiryInSeconds,
    };
    return this.storageManagementService.generateUrlToUploadFile({
      body,
    });
  }
}
