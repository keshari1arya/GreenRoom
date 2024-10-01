import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { SubscriptionState } from '../store/subscription.reducer';
import { Subscription } from 'rxjs';
import { createSubscription, editSubscriptionById, updateSubscription } from '../store/subscription.actions';
import { selectData } from '../store/subscription.selectors';
import { UpdateSubscriptionCommand } from 'src/app/lib/openapi-generated/models';

@Component({
  selector: 'app-subscription-create',
  templateUrl: './subscription-create.component.html',
  styleUrl: './subscription-create.component.css'
})
export class SubscriptionCreateComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private store: Store<SubscriptionState>
  ) {
    this.createForm();
  }


  createSubscriptionForm: FormGroup;


  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params.id) {
        this.store.dispatch(
          editSubscriptionById({ id: params.id })
        );

        this.store.select(selectData).subscribe((subscriptions) => {
          if (subscriptions) {
            const subscription = subscriptions[params.id] as UpdateSubscriptionCommand;
            this.createSubscriptionForm.patchValue({
              id: subscription.id,
              name: subscription.name,
              description: subscription.description,
              price: subscription.price,
              isActive: subscription.isActive
            });
          }
        });

      }
    })
  }

  onSubmit() {
    if (this.createSubscriptionForm.invalid) {
      this.createSubscriptionForm.markAllAsTouched();
      return;
    }
    if (this.createSubscriptionForm.value.id) {
      this.store.dispatch(updateSubscription({
        subscriptions: {
          id: this.createSubscriptionForm.value.id,
          name: this.createSubscriptionForm.value.name,
          description: this.createSubscriptionForm.value.description,
          price: this.createSubscriptionForm.value.price,
          isActive: this.createSubscriptionForm.value.isActive
        },
      }))
      return;
    } else {
      this.store.dispatch(createSubscription({
        subscriptions: {
          name: this.createSubscriptionForm.value.name,
          description: this.createSubscriptionForm.value.description,
          price: this.createSubscriptionForm.value.price,
          isActive: this.createSubscriptionForm.value.isActive
        },
      }))
    }


  }

  private createForm() {
    this.createSubscriptionForm = this.formBuilder.group({
      id: [0],
      name: ["", [Validators.required, Validators.minLength(3)]],
      description: ["", [Validators.required, Validators.minLength(5)]],
      price: [Number, [Validators.required, Validators.minLength(5)]],
      isActive: [true]
    });
  }
}
