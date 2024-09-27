import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MultitenantState } from "../store/multitenant.reducer";
import { Store } from "@ngrx/store";
import { multitenantActions } from "../store/multitenant.actions";
import { ActivatedRoute } from "@angular/router";
import { selectTenant } from "../store/multitenant.selector";

@Component({
  selector: "app-edit-tenant",
  templateUrl: "./edit-tenant.component.html",
  styleUrl: "./edit-tenant.component.scss",
})
export class EditTenantComponent implements OnInit {
  breadCrumbItems = [
    { label: "Tenants" },
    { label: "Create New", active: true },
  ];

  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<MultitenantState>,
    private route: ActivatedRoute
  ) {
    this.createForm();
  }
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params.id) {
        this.store.dispatch(
          multitenantActions.fetchTenantById({ tenantId: params.id })
        );

        this.store.select(selectTenant).subscribe((tenant) => {
          if (tenant) {
            this.form.patchValue({
              id: tenant.id,
              name: tenant.name,
              description: tenant.description,
              //logo: state.logo,
            });
          }
        });
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.form.value.id) {
      this.store.dispatch(
        multitenantActions.updateTenant({
          tenant: {
            id: this.form.value.id,
            name: this.form.value.name,
            description: this.form.value.description,
            //logo: this.imageURLs,
          },
        })
      );
      return;
    } else {
      this.store.dispatch(
        multitenantActions.createTenant({
          tenant: {
            name: this.form.value.name,
            description: this.form.value.description,
            //logo: this.imageURLs,
          },
        })
      );
    }
  }

  getValidationClass(controlName: string) {
    const control = this.form.get(controlName);
    if (control?.touched && control?.invalid) {
      return "is-invalid";
    }
    return "is-valid";
  }

  // filechange
  imageURLs: any;
  fileChange(event: any) {
    let fileList: any = event.target as HTMLInputElement;
    let file: File = fileList.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => {
      this.imageURLs = reader.result as string;

      document.querySelectorAll("#projectlogo-img").forEach((element: any) => {
        element.src = this.imageURLs;
      });
    };
  }

  private createForm() {
    this.form = this.formBuilder.group({
      id: [""],
      name: ["", [Validators.required, Validators.minLength(3)]],
      description: ["", [Validators.required, Validators.minLength(5)]],
      logo: [""],
    });
  }
}
