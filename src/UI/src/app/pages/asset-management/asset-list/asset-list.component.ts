import { Component, Input, OnInit } from '@angular/core';
import { FolderDto } from 'src/app/lib/openapi-generated/models';

@Component({
  selector: 'app-asset-list',
  templateUrl: './asset-list.component.html',
  styleUrls: ['./asset-list.component.scss'],
})
export class AssetListComponent implements OnInit {
  @Input() folders: FolderDto[] = [];
  constructor() {}
  ngOnInit(): void {}

  folderName = 'Home';

  displayedColumns: string[] = ['name'];
  defaultImage = 'assets/images/svgs/folder.svg';
}
