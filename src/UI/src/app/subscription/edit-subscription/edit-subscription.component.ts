import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { SubscriptionState } from '../store/subscription.reducer';
import { Subscription } from 'rxjs';
import { createSubscription, editSubscriptionById, updateSubscription } from '../store/subscription.actions';
import { selectData, selectSubscriptionDetails } from '../store/subscription.selectors';
import { UpdateSubscriptionCommand } from 'src/app/lib/openapi-generated/models';

@Component({
  selector: 'app-subscription-create',
  templateUrl: './edit-subscription.component.html',
  styleUrl: './edit-subscription.component.scss'
})
export class EditSubscriptionComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private store: Store<SubscriptionState>
  ) {
    this.createForm();
  }


  SubscriptionForm: FormGroup;


  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params.id) {
        this.store.dispatch(
          editSubscriptionById({ id: params.id })
        );

        this.store.select(selectSubscriptionDetails).subscribe((res) => {
          if (res) {
            this.SubscriptionForm.patchValue({
              id: res.id,
              name: res.name,
              description: res.description,
              price: res.price,
              isActive: res.isActive
            });
          }
        });

      }
    })
  }

  onSubmit() {
    if (this.SubscriptionForm.invalid) {
      this.SubscriptionForm.markAllAsTouched();
      return;
    }
    if (this.SubscriptionForm.value.id) {
      this.store.dispatch(updateSubscription({
        subscriptions: {
          id: this.SubscriptionForm.value.id,
          name: this.SubscriptionForm.value.name,
          description: this.SubscriptionForm.value.description,
          price: this.SubscriptionForm.value.price,
          isActive: this.SubscriptionForm.value.isActive
        },
      }))
      return;
    } else {
      this.store.dispatch(createSubscription({
        subscriptions: {
          name: this.SubscriptionForm.value.name,
          description: this.SubscriptionForm.value.description,
          price: this.SubscriptionForm.value.price,
          isActive: this.SubscriptionForm.value.isActive
        },
      }))
    }
  }

  private createForm() {
    this.SubscriptionForm = this.formBuilder.group({
      id: [0],
      name: ["", [Validators.required, Validators.minLength(3)]],
      description: ["", [Validators.required, Validators.minLength(5)]],
      price: [Number, [Validators.required, Validators.minLength(5)]],
      isActive: [true]
    });
  }
}
