import { Component, OnInit } from "@angular/core";
import { FileManagerState } from "../store/file-manager.reducer";
import { Store } from "@ngrx/store";
import { ActivatedRoute } from "@angular/router";
import { fetchAssetDetails } from "../store/file-manager.actions";
import { selectAssetDetails } from "../store/file-manager-selector";

@Component({
  selector: "app-asset-details",
  templateUrl: "./asset-details.component.html",
  styleUrl: "./asset-details.component.scss",
})
export class AssetDetailsComponent implements OnInit {
  breadCrumbItems = [{ label: "Asset" }, { label: "Details", active: true }];
  asset$ = this.store.select(selectAssetDetails);

  constructor(
    private store: Store<FileManagerState>,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const assetId = params.get("id");
      if (assetId) {
        this.store.dispatch(fetchAssetDetails({ assetId: +assetId }));
      }
    });
  }

  // TODO: send viewer dynamically based on file type

  canShow(name: string) {
    return this.supportedFileTypes.includes(name.split(".").pop());
  }

  private supportedFileTypes = ["pdf", "jpg", "png"];
}
