import { Component, OnInit, TemplateRef } from "@angular/core";
import { Store } from "@ngrx/store";
import { multitenantActions } from "../store/multitenant.actions";
import {
  selectGetRoleId,
  selectMultitenantError,
  selectMultitenantLoading,
  selectSearchUsers,
  selectTenant,
  selectTenantUsers,
  selectUserInvited,
} from "../store/multitenant.selector";
import { EMPTY, Observable, of } from "rxjs";
import {
  SearchUserDto,
  TenantRolesDto,
  TenantUsersDto,
} from "src/app/lib/openapi-generated/models";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-user-manager",
  templateUrl: "./user-manager.component.html",
  styleUrl: "./user-manager.component.scss",
})
export class UserManagerComponent implements OnInit {
  tenantUsers$!: Observable<TenantUsersDto[]>;
  loading$!: Observable<boolean>;
  error$!: Observable<string>;
  modalRef?: BsModalRef;

  searchUsers$!: Observable<SearchUserDto[]>;
  getRoleId$!: Observable<TenantRolesDto[]>;

  constructor(
    private store: Store,
    private modalService: BsModalService,
    private fromBuilder: FormBuilder
  ) {
    this.tenantUsers$ = this.store.select(selectTenantUsers);
    this.loading$ = this.store.select(selectMultitenantLoading);
    this.error$ = this.store.select(selectMultitenantError);
    this.searchUsers$ = this.store.select(selectSearchUsers);
    this.getRoleId$ = this.store.select(selectGetRoleId);
    this.createForm();
  }

  AddUserForm: FormGroup;

  ngOnInit(): void {
    this.store.dispatch(multitenantActions.fetchTenantUsers());
    this.store.dispatch(multitenantActions.getTenantRoles());
  }

  openModal(template: TemplateRef<any>) {
    const config: any = {
      backdrop: true,
      ignoreBackdropClick: true,
      class: "modal-lg",
    };
    this.modalRef = this.modalService.show(template, config);
  }
  closeModal() {
    this.modalRef?.hide();
    this.store.dispatch(multitenantActions.clearSearchResults());
    this.AddUserForm.reset();
    this.isUserInvite = false;
    this.isDataPresent = false;
  }

  isUserInvite: boolean = false;
  isDataPresent: boolean = false;
  validateEmail(email: string): boolean {
    // Regex pattern for validating email
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    // Test if the email matches the pattern
    return emailPattern.test(email);
  }

  invitedUser() {
    if (this.validateEmail(this.AddUserForm.value.search)) {
      console.log("This is Valid Email");
      this.isUserInvite = true;
    } else {
      console.log("This is invalid Email");
      this.isUserInvite = false;
    }
  }

  onSubmit() {
    if (this.AddUserForm.value.search) {
      this.store.dispatch(
        multitenantActions.searchUsers({
          searchTerm: this.AddUserForm.value.search,
        })
      );
      this.searchUsers$.subscribe((res) => {
        if (Array.isArray(res) && res.length === 0) {
          console.log("no user found");
          this.invitedUser();
          this.isDataPresent = false;
        } else {
          this.isDataPresent = true;
        }
      });
    }
  }

  inviteUser() {
    this.store.dispatch(
      multitenantActions.inviteUser({
        email: this.AddUserForm.value.search,
        roleId: this.selectedOptionId,
      })
    );
    this.store.select(selectUserInvited).subscribe((res) => {
      if (res) {
        this.closeModal();
      }
    });
  }

  private createForm() {
    this.AddUserForm = this.fromBuilder.group({
      search: ["", [Validators.required]],
      role: [""],
    });
  }

  selectedOptionId: any = 1;

  getValue(event) {
    this.selectedOptionId = +event.target.value;
  }

  AddUsers(event) {
    this.store.dispatch(
      multitenantActions.addUser({
        user: {
          userId: event.id,
          roleId: this.selectedOptionId,
        },
      })
    );
  }

  selectRoleId: any = null;
  getId(event, User) {
    this.selectRoleId = +event.target.value;
    this.store.dispatch(
      multitenantActions.updateRoleId({
        userRole: {
          userId: User.userId,
          roleId: this.selectRoleId,
        },
      })
    );
  }
}
