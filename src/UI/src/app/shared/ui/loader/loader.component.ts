import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { selectIsLoading } from "../../store/shared.selector";
import { SharedState } from "../../store/shared.reducer";

@Component({
  selector: "app-loader",
  templateUrl: "./loader.component.html",
  styleUrls: ["./loader.component.scss"],
})
export class LoaderComponent {
  isLoading = this.store.select(selectIsLoading);

  constructor(private store: Store<SharedState>) {}
}
