import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FolderDto } from 'src/app/lib/openapi-generated/models';
import { FoldersService } from 'src/app/lib/openapi-generated/services';

@Component({
  selector: 'app-asset-list-shell',
  templateUrl: './asset-list-shell.component.html',
  styleUrl: './asset-list-shell.component.scss',
})
export class AssetListShellComponent implements OnInit {
  constructor(private folderService: FoldersService) {}
  folders$: Observable<Array<FolderDto>> = of(Array<FolderDto>());
  ngOnInit(): void {
    this.folders$ = this.folderService.getFolders();
  }
}
