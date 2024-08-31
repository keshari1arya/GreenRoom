import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { AssetsService } from 'src/app/lib/openapi-generated/services';

@Component({
  selector: 'app-asset-list',
  // standalone: true,
  // imports: [],
  templateUrl: './asset-list.component.html',
  styleUrl: './asset-list.component.scss',
})
export class AssetListComponent implements OnInit {
  displayedColumns: string[] = ['assigned', 'name', 'priority', 'budget'];
  dataSource = [
    {
      id: 1,
      imagePath: 'assets/images/profile/user-1.jpg',
      uname: 'Sunil Joshi',
      position: 'Web Designer',
      productName: 'Elite Admin',
      budget: 3.9,
      priority: 'low',
    },
    {
      id: 2,
      imagePath: 'assets/images/profile/user-2.jpg',
      uname: 'Andrew McDownland',
      position: 'Project Manager',
      productName: 'Real Homes Theme',
      budget: 24.5,
      priority: 'medium',
    },
    {
      id: 3,
      imagePath: 'assets/images/profile/user-3.jpg',
      uname: 'Christopher Jamil',
      position: 'Project Manager',
      productName: 'MedicalPro Theme',
      budget: 12.8,
      priority: 'high',
    },
    {
      id: 4,
      imagePath: 'assets/images/profile/user-4.jpg',
      uname: 'Nirav Joshi',
      position: 'Frontend Engineer',
      productName: 'Hosting Press HTML',
      budget: 2.4,
      priority: 'critical',
    },
  ];

  constructor(private assetService: AssetsService) {}
  ngOnInit(): void {
    this.assetService
      .getAssets()
      .pipe(map((res) => console.log(res)))
      .subscribe();
  }
}
