import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, inject, OnInit } from '@angular/core';
import { FolderDto } from 'src/app/lib/openapi-generated/models';
import { FoldersService } from 'src/app/lib/openapi-generated/services';

@Component({
  selector: 'app-asset-list',
  templateUrl: './asset-list.component.html',
  styleUrls: ['./asset-list.component.scss'],
})
export class AssetListComponent implements OnInit {
  folders: FolderDto[] = [];
  constructor(private folderService: FoldersService) {}
  ngOnInit(): void {
    this.folderService.getFolders().subscribe((res) => {
      this.folders = res;
      console.log(res);
    });
  }

  folderName = 'Home';

  displayedColumns: string[] = ['name'];
  defaultImage = 'assets/images/svgs/folder.svg';
}
