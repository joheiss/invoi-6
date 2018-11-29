import {ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy} from '@angular/core';
import {DetailsFormComponent} from '../../abstracts/details-form.component';
import {Invoice, InvoiceData} from '../../models/invoice.model';
import {Contract} from '../../models/contract.model';
import {Receiver} from '../../models/receiver.model';
import {AppState} from '../../../app/store/reducers';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Store} from '@ngrx/store';
import * as fromValidators from '../../../shared/validators';
import {I18nUtilityService} from '../../../shared/i18n-utility/i18n-utility.service';

@Component({
  selector: 'jo-quick-invoice-form',
  templateUrl: './quick-invoice-form.component.html',
  styleUrls: ['./quick-invoice-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuickInvoiceFormComponent extends DetailsFormComponent<Invoice> implements OnChanges, OnDestroy {
  @Input() invoiceReceiver: Receiver;
  @Input() invoiceContract: Contract;

  constructor(protected fb: FormBuilder,
              protected store: Store<AppState>,
              protected router: Router,
              protected utility: I18nUtilityService) {
    super(fb, store, router, utility);
  }

  getFormTitle(): string {
    return null;
  }

  protected buildForm(): FormGroup {
    return this.fb.group({
      issuedAt: ['', [Validators.required]],
      billingPeriod: ['', [Validators.required]],
      quantity: ['', [Validators.required, Validators.pattern(fromValidators.REGEXP_AMOUNT)]],
      description: ['', [Validators.required]]
    });
  }

  protected changeObject(values: any): Invoice {
    const reformattedItemValues = {
      quantity: this.utility.fromLocalAmount(values.quantity),
      description: values.description
    };
    const reformattedValues = {
      issuedAt: values.issuedAt,
      billingPeriod: values.billingPeriod
    };
    const changed = Object.assign({},
      {...this.object.data},
      {...reformattedValues}) as InvoiceData;
    changed.items[0].quantity = reformattedItemValues.quantity;
    changed.items[0].description = reformattedItemValues.description;
    const changedInvoice = Invoice.createFromData(changed);
    this.changed.emit(changedInvoice);
    return changedInvoice;
  }

  protected listenToChanges() {
    this.listenToFieldChanges('issuedAt', this.onSimpleHeaderDateChanged);
    this.listenToFieldChanges('billingPeriod', this.onSimpleHeaderTextChanged);
    this.listenToFieldChanges('quantity', this.onQuantityChanged);
    this.listenToFieldChanges('description', this.onDescriptionChanged);
  }

  private onDescriptionChanged = (value: any, controlName?: string) => {
    const newValue = value;
    this.object.items[0].description = newValue;
    this.changed.emit(this.object);
  }

  private onQuantityChanged = (value: any, controlName?: string) => {
    const newValue = this.utility.fromLocalAmount(value);
    this.object.items[0].quantity = newValue;
    this.changed.emit(this.object);
  }

  protected patchForm() {
    const reformattedValues = {
      receiverId: this.object.header.receiverId,
      contractId: this.object.header.contractId,
      issuedAt: this.object.header.issuedAt,
      billingPeriod: this.object.header.billingPeriod,
      quantity: this.utility.toLocalAmount(this.object.items[0].quantity),
      description: this.object.items[0].description,
      netValue: this.utility.toLocalAmount(this.object.netValue),
      vatAmount: this.utility.toLocalAmount(this.object.vatAmount),
      grossValue: this.utility.toLocalAmount(this.object.grossValue),
      cashDiscountBaseAmount: this.utility.toLocalAmount(this.object.cashDiscountBaseAmount),
      cashDiscountAmount: this.utility.toLocalAmount(this.object.cashDiscountAmount),
      paymentAmount: this.utility.toLocalAmount(this.object.paymentAmount)
    };
    const patch = Object.assign({}, {...reformattedValues});
    this.form.patchValue(patch);
  }

}
