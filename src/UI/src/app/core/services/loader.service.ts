import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import {
  addHttpRequestForLoader,
  removeHttpRequestForLoader,
} from "src/app/shared/store/shared.actions";
import { SharedState } from "src/app/shared/store/shared.reducer";

@Injectable({
  providedIn: "root",
})
export class LoaderService {
  // TODO: when we have to control loader in effects we just call showLoader() and hideLoader() methods instead of dispatching actions
  constructor(private store: Store<SharedState>) {}

  public showLoader() {
    this.store.dispatch(addHttpRequestForLoader());
  }

  public hideLoader() {
    this.store.dispatch(removeHttpRequestForLoader());
  }
}
