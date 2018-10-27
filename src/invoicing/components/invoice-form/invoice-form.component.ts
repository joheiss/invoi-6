import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, Output} from '@angular/core';
import {Invoice, InvoiceData} from '../../models/invoice.model';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Receiver} from '../../models/receiver.model';
import {I18nUtilityService} from '../../../shared/i18n-utility/i18n-utility.service';
import {Router} from '@angular/router';
import * as fromValidators from '../../../shared/validators';
import {Contract} from '../../models/contract.model';
import {DetailsFormComponent} from '../../abstracts/details-form.component';
import {Store} from '@ngrx/store';
import {AppState} from '../../../app/store/reducers';
import {minOneItemValidator} from '../../validators/minOneItem.validator';

@Component({
  selector: 'jo-invoice-form',
  templateUrl: './invoice-form.component.html',
  styleUrls: ['./invoice-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoiceFormComponent extends DetailsFormComponent<Invoice> implements OnChanges, OnDestroy {
  @Input() invoiceReceiver: Receiver;
  @Input() invoiceContract: Contract;
  @Input() receivers: Receiver[];
  @Input() contracts: Contract[];
  @Input() isChangeable: boolean;
  @Input() isSendable: boolean;
  @Input() mode: string;
  @Output() createPdf = new EventEmitter<Invoice>();
  @Output() sendEmail = new EventEmitter<Invoice>();

  constructor(protected fb: FormBuilder,
              protected store: Store<AppState>,
              protected router: Router,
              protected utility: I18nUtilityService) {
    super(fb, store, router, utility);
  }

  onEmail() {
    this.sendEmail.emit(this.object);
  }

  onPdf() {
    this.createPdf.emit(this.object);
    this.form.reset();
  }

  getFormTitle(): string {
    return this.object.header.id ? `${this.object.header.id} - ${this.object.header.billingPeriod}` : `[neu]`;
  }

  protected buildForm(): FormGroup {
    return this.fb.group({
      id: [{value: '', disabled: true}],
      issuedAt: ['', [Validators.required]],
      status: ['', [Validators.required]],
      billingPeriod: ['', [Validators.required]],
      receiverId: ['', [Validators.required]],
      contractId: ['', [Validators.required]],
      billingMethod: ['', [Validators.required]],
      currency: ['', [Validators.required]],
      paymentTerms: ['', [Validators.required]],
      paymentMethod: ['', [Validators.required]],
      cashDiscountDays: ['', [Validators.pattern(fromValidators.REGEXP_DIGITS)]],
      cashDiscountPercentage: ['', [Validators.pattern(fromValidators.REGEXP_AMOUNT)]],
      dueInDays: ['', [Validators.required, Validators.pattern(fromValidators.REGEXP_DIGITS)]],
      vatPercentage: ['', [Validators.pattern(fromValidators.REGEXP_AMOUNT)]],
      documentUrl: [''],
      invoiceText: [''],
      internalText: [''],
      items: new FormArray([], [minOneItemValidator])
    });
  }

  protected changeObject(values: any): Invoice {
    const {items: items, ...header} = values;
    const reformattedItemValues = items.map(item => Object.assign({}, item, {
      quantity: this.utility.fromLocalAmount(item.quantity),
      pricePerUnit: this.utility.fromLocalAmount(item.pricePerUnit)
    }));
    const reformattedValues = {
      status: +values.status,
      vatPercentage: this.utility.fromLocalAmount(values.vatPercentage),
      cashDiscountPercentage: this.utility.fromLocalPercent(values.cashDiscountPercentage),
      cashDiscountDays: +values.cashDiscountDays
    };
    const changed = Object.assign({},
      {...this.object.data},
      {...header},
      {...reformattedValues},
      {items: reformattedItemValues}) as InvoiceData;
    const changedInvoice = Invoice.createFromData(changed);
    this.changed.emit(changedInvoice);
    return changedInvoice;
  }

  protected listenToChanges() {
    this.listenToFieldChanges('status', this.onSimpleHeaderNumberChanged);
    this.listenToFieldChanges('issuedAt', this.onSimpleHeaderDateChanged);
    this.listenToFieldChanges('receiverId', this.onReceiverIdChanged);
    this.listenToFieldChanges('contractId', this.onContractIdChanged);
    this.listenToFieldChanges('billingMethod', this.onSimpleHeaderNumberChanged);
    this.listenToFieldChanges('vatPercentage', this.onVatPercentageChanged);
    this.listenToFieldChanges('cashDiscountPercentage', this.onCashDiscountPercentageChanged);
    this.listenToFieldChanges('cashDiscountDays', this.onSimpleHeaderNumberChanged);
    this.listenToFieldChanges('dueInDays', this.onSimpleHeaderNumberChanged);
    this.listenToFieldChanges('billingPeriod', this.onSimpleHeaderTextChanged);
    this.listenToFieldChanges('currency', this.onSimpleHeaderTextChanged);
    this.listenToFieldChanges('paymentTerm', this.onSimpleHeaderTextChanged);
    this.listenToFieldChanges('invoiceText', this.onSimpleHeaderTextChanged);
    this.listenToFieldChanges('internalText', this.onSimpleHeaderTextChanged);
    this.listenToFieldChanges('documentUrl', this.onSimpleHeaderTextChanged);
    this.listenToFieldChanges('paymentMethod', this.onSimpleHeaderNumberChanged);
  }

  private onCashDiscountPercentageChanged = (value: any, controlName?: string) => {
    const newValue = this.utility.fromLocalPercent(value);
    this.object.header.cashDiscountPercentage = newValue;
    this.changed.emit(this.object);
  }

  private onContractIdChanged = (value: any, controlName?: string) => {
    console.log('contract assignment changed: ', value);
    const newValue = value;
    this.invoiceContract = this.contracts.find(contract => contract.header.id === newValue);
    this.object.header.contractId = newValue;
    this.changed.emit(this.object);
  }

  private onReceiverIdChanged = (value: any, controlName?: string) => {
    const newValue = value;
    this.object.header.receiverId = newValue;
    this.invoiceReceiver = this.receivers.find(receiver => receiver.data.id === this.object.header.receiverId);
    this.contracts = this.contracts.filter(contract => contract.header.customerId === newValue);
    this.changed.emit(this.object);
  }

  private onVatPercentageChanged = (value: any) => {
    const newValue = this.utility.fromLocalPercent(value);
    this.object.vatPercentage = newValue;
    this.changed.emit(this.object);
  }

  protected patchForm(): void {
    const reformattedValues = {
      status: this.object.header.status.toString(),
      issuedAt: this.object.header.issuedAt,
      cashDiscountPercentage: this.utility.toLocalPercent(this.object.header.cashDiscountPercentage),
      vatPercentage: this.utility.toLocalPercent(this.object.vatPercentage),
      netValue: this.utility.toLocalAmount(this.object.netValue),
      vatAmount: this.utility.toLocalAmount(this.object.vatAmount),
      grossValue: this.utility.toLocalAmount(this.object.grossValue),
      cashDiscountBaseAmount: this.utility.toLocalAmount(this.object.cashDiscountBaseAmount),
      cashDiscountAmount: this.utility.toLocalAmount(this.object.cashDiscountAmount),
      paymentAmount: this.utility.toLocalAmount(this.object.paymentAmount)
    };
    const patch = Object.assign({}, {...this.object.header}, reformattedValues);
    this.form.patchValue(patch);
    this.logErrors();
  }

  private logErrors() {
    Object.keys(this.form.controls).forEach(key => {
      if (this.form.get(key).errors) { console.log(key, this.form.get(key).errors || 'no errors'); }
    });
  }
}
