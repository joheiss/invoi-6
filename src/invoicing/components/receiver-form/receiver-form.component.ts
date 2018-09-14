import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {Receiver, ReceiverData} from '../../models/receiver.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

import * as fromValidators from '../../../shared/validators';
import {MatDialog} from '@angular/material';
import {DetailsFormComponent} from '../../abstracts/details-form.component';
import {Store} from '@ngrx/store';
import {AppState} from '../../../app/store/reducers';
import {Contract} from '../../models/contract.model';
import {Invoice} from '../../models/invoice.model';

@Component({
  selector: 'jo-receiver-form',
  templateUrl: './receiver-form.component.html',
  styleUrls: ['./receiver-form.component.scss']
})
export class ReceiverFormComponent extends DetailsFormComponent<Receiver> implements OnChanges {
  @Input('isDeletable') isDeletable: boolean;
  @Input('isQualForQuickInvoice') isQualForQuickInvoice: boolean;
  @Input('activeContracts') activeContracts: Contract[];
  @Input('lastContracts') lastContracts: Contract[];
  @Input('openInvoices') openInvoices: Invoice[];
  @Input('lastInvoices') lastInvoices: Contract[];
  @Input('task') task: string;
  @Input('countries') countries: any[];
  @Output('quickInvoice') quickInvoice = new EventEmitter<Receiver>();

  constructor(protected fb: FormBuilder,
              protected store: Store<AppState>,
              protected router: Router) {
    super(fb, store, router);
  }

  getFormTitle(): string {
    return this.object.header.id ? `${this.object.header.id} - ${this.object.header.name}` : `[neu]`;
  }

  onQuickInvoice(receiver: Receiver) {
    this.quickInvoice.emit(receiver);
  }

  protected buildForm(): FormGroup {
    return this.fb.group({
      id: [{value: '', disabled: true}],
      status: [''],
      name: ['', [Validators.required]],
      nameAdd: [''],
      country: [''],
      postalCode: ['', [Validators.required]],
      city: ['', [Validators.required]],
      street: [''],
      email: ['', [Validators.pattern(fromValidators.REGEXP_EMAIL)]],
      phone: ['', [Validators.pattern(fromValidators.REGEXP_PHONE)]],
      fax: ['', [Validators.pattern(fromValidators.REGEXP_PHONE)]],
      webSite: ['', [Validators.pattern(fromValidators.REGEXP_URL)]],
      logoUrl: ['', [Validators.pattern(fromValidators.REGEXP_URL)]]
    });
  }

  protected changeObject(values: any): Receiver {
    const changed = Object.assign({}, this.object.data, {
      status: +values.status,
      name: values.name,
      nameAdd: values.nameAdd,
      logoUrl: values.logoUrl,
      address: {
        country: values.country,
        postalCode: values.postalCode,
        city: values.city,
        street: values.street,
        email: values.email,
        phone: values.phone,
        fax: values.fax,
        webSite: values.webSite
      }
    }) as ReceiverData;

    console.log('changed receiver: ', changed);
    const changedReceiver = Receiver.createFromData(changed);
    console.log('changed receiver object: ', changedReceiver);
    this.changed.emit(changedReceiver);
    return changedReceiver;
  }

  protected listenToChanges() {
  }

  protected patchForm(): void {
    const reformattedValues = {
      status: this.object.header.status.toString()
    };
    const patch = Object.assign({}, {...this.object.header, ...this.object.address}, reformattedValues);
    this.form.patchValue(patch);
  }
}
