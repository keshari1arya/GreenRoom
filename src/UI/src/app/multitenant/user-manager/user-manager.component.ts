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
} from "../store/multitenant.selector";
import { Observable, of } from "rxjs";
import { SearchUserDto, TenantRolesDto, TenantUsersDto } from "src/app/lib/openapi-generated/models";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-user-manager',
  templateUrl: './user-manager.component.html',
  styleUrl: './user-manager.component.scss'
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
    this.store.dispatch(multitenantActions.getRoleId());
  }

  openModal(template: TemplateRef<any>) {
    const config: any = {
      backdrop: true,
      ignoreBackdropClick: true,
      class: "modal-lg"
    };
    this.modalRef = this.modalService.show(template, config);
  }

  onSubmit() {
    if (this.AddUserForm.value.search) {
      this.store.dispatch(multitenantActions.searchUsers({ searchTerm: this.AddUserForm.value.search }))
    }
  }

  private createForm() {
    this.AddUserForm = this.fromBuilder.group({
      search: ['', [Validators.required]],
      role: ['']
    })
  }


  selectedOptionId: any = 1;

  getValue(event) {
    this.selectedOptionId = +event.target.value;
  }

  AddUsers(event) {
    this.store.dispatch(multitenantActions.addUser({
      user: {
        userId: event.id,
        roleId: this.selectedOptionId
      }
    }))
  }

  selectRoleId: any = null;
  getId(event, User) {
    this.selectRoleId = +event.target.value;
    this.store.dispatch(multitenantActions.updateRoleId({
      userRole: {
        userId: User.userId,
        roleId: this.selectRoleId
      }
    }))
  }
}
