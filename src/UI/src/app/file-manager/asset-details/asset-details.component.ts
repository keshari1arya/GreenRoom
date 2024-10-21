import { Component, OnInit } from "@angular/core";
import { FileManagerState } from "../store/file-manager.reducer";
import { Store } from "@ngrx/store";
import { ActivatedRoute } from "@angular/router";
import {
  addTag,
  clearAssetDetails,
  fetchAssetDetails,
  removeTag,
} from "../store/file-manager.actions";
import { selectAssetDetails } from "../store/file-manager-selector";
import { Utility } from "../shared/classes/utility";

@Component({
  selector: "app-asset-details",
  templateUrl: "./asset-details.component.html",
  styleUrl: "./asset-details.component.scss",
  providers: [Utility],
})
export class AssetDetailsComponent implements OnInit {
  breadCrumbItems = [{ label: "Asset" }, { label: "Details", active: true }];
  asset$ = this.store.select(selectAssetDetails);
  assetId: number;

  constructor(
    private store: Store<FileManagerState>,
    private route: ActivatedRoute,
    public utility: Utility
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.assetId = +params.get("id");
      if (this.assetId) {
        this.store.dispatch(fetchAssetDetails({ assetId: this.assetId }));
      }
    });
  }

  getViewerType(name: string) {
    const d = {
      pdf: ["pdf"],
    };
    return name.split(".").pop();
  }

  canShow(name: string) {
    return this.supportedFileTypes.includes(name?.split(".").pop());
  }

  ngOnDestroy(): void {
    this.store.dispatch(clearAssetDetails());
  }

  removeTag($event: any) {
    this.store.dispatch(removeTag({ tag: $event, assetId: this.assetId }));
  }

  addTag($event: any) {
    this.store.dispatch(addTag({ tag: $event.value, assetId: this.assetId }));
  }

  private supportedFileTypes = [
    "pdf",
    "jpg",
    "jpeg",
    "png",
    "docx",
    "xlsx",
    "pptx",
    "doc",
    "xls",
    "ppt",
    "html",
    "txt",
  ];

  tempUrl =
    "https://docs.google.com/presentation/d/1bDRBcwnwGtm_80WX1uDE9sXwDPXQl7gnDAQpvbwtlwU/edit?usp=sharing";
}
