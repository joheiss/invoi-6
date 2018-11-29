import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, Output} from '@angular/core';
import {Contract, ContractData} from '../../models/contract.model';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as fromValidators from '../../../shared/validators';
import {Router} from '@angular/router';
import {Receiver} from '../../models/receiver.model';
import {I18nUtilityService} from '../../../shared/i18n-utility/i18n-utility.service';
import {DetailsFormComponent} from '../../abstracts/details-form.component';
import {Store} from '@ngrx/store';
import {AppState} from '../../../app/store/reducers';
import {endDateValidator} from '../../validators/endDate.validator';
import {Invoice} from '../../models/invoice.model';
import {minOneItemValidator} from '../../validators/minOneItem.validator';

@Component({
  selector: 'jo-contract-form',
  templateUrl: './contract-form.component.html',
  styleUrls: ['./contract-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContractFormComponent extends DetailsFormComponent<Contract> implements OnChanges, OnDestroy {
  @Input() contractPartner;
  @Input() isChangeable: boolean;
  @Input() receivers: Receiver[];
  @Input() openInvoices: Invoice[];
  @Input() allInvoices: Invoice[];
  @Input() task: string;
  @Output() quickInvoice = new EventEmitter<Contract>();

  constructor(protected fb: FormBuilder,
              protected store: Store<AppState>,
              protected router: Router,
              protected utility: I18nUtilityService) {
    super(fb, store, router, utility);
  }

  getFormTitle(): string {
    return this.object.header.id ? `${this.object.header.id} - ${this.object.header.description }` : `[neu]`;
  }

  onQuickInvoice(contract: Contract) {
    this.quickInvoice.emit(contract);
  }

  protected buildForm(): FormGroup {
    return this.fb.group({
      id: [{value: '', disabled: true}],
      issuedAt: ['', [Validators.required]],
      description: ['', [Validators.required]],
      customerId: ['', [Validators.required, Validators.pattern(fromValidators.REGEXP_DIGITS)]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      currency: ['', [Validators.required]],
      budget: ['', [Validators.pattern(fromValidators.REGEXP_AMOUNT)]],
      billingMethod: ['', [Validators.required]],
      paymentTerms: ['', [Validators.required]],
      paymentMethod: ['', [Validators.required]],
      cashDiscountDays: ['', [Validators.pattern(fromValidators.REGEXP_DIGITS)]],
      cashDiscountPercentage: ['', [Validators.pattern(fromValidators.REGEXP_AMOUNT)]],
      dueDays: ['', [Validators.required, Validators.pattern(fromValidators.REGEXP_DIGITS)]],
      documentUrl: ['', [Validators.pattern(fromValidators.REGEXP_URL)]],
      invoiceText: [''],
      internalText: [''],
      items: new FormArray([], [minOneItemValidator])
    }, [{ validator: endDateValidator }]);
  }

  protected changeObject(values: any): Contract {
    const {items: items, ...header} = values;
    const reformattedItemValues = items.map(item => Object.assign({}, item, {
      pricePerUnit: this.utility.fromLocalAmount(item.pricePerUnit)
    }));
    const reformattedValues = {
      budget: this.utility.fromLocalAmount(values.budget),
      cashDiscountPercentage: this.utility.fromLocalPercent(values.cashDiscountPercentage)
    };
    const changed = Object.assign({},
      {...this.object.data},
      {...header},
      {...reformattedValues},
      {items: reformattedItemValues}) as ContractData;
    const changedContract = Contract.createFromData(changed);
    this.changed.emit(changedContract);
    return changedContract;
  }

  protected listenToChanges() {
    this.listenToFieldChanges('customerId', this.onSimpleHeaderTextChanged);
    this.listenToFieldChanges('description', this.onSimpleHeaderTextChanged);
    this.listenToFieldChanges('issuedAt', this.onSimpleHeaderDateChanged);
    this.listenToFieldChanges('startDate', this.onSimpleHeaderDateChanged);
    this.listenToFieldChanges('endDate', this.onSimpleHeaderDateChanged);
    this.listenToFieldChanges('budget', this.onSimpleHeaderAmountChanged);
    this.listenToFieldChanges('currency', this.onSimpleHeaderTextChanged);
    this.listenToFieldChanges('billingMethod', this.onSimpleHeaderNumberChanged);
    this.listenToFieldChanges('paymentMethod', this.onSimpleHeaderNumberChanged);
    this.listenToFieldChanges('paymentTerms', this.onSimpleHeaderTextChanged);
    this.listenToFieldChanges('cashDiscountPercentage', this.onSimpleHeaderPercentageChanged);
    this.listenToFieldChanges('cashDiscountDays', this.onSimpleHeaderNumberChanged);
    this.listenToFieldChanges('dueDays', this.onSimpleHeaderNumberChanged);
    this.listenToFieldChanges('invoiceText', this.onSimpleHeaderTextChanged);
    this.listenToFieldChanges('internalText', this.onSimpleHeaderTextChanged);
    this.listenToFieldChanges('documentUrl', this.onSimpleHeaderTextChanged);
  }

  protected patchForm(): void {
    const reformattedValues = {
      issuedAt: this.object.header.issuedAt,
      startDate: this.object.header.startDate,
      endDate: this.object.header.endDate,
      cashDiscountPercentage: this.utility.toLocalPercent(this.object.header.cashDiscountPercentage),
      budget: this.utility.toLocalAmount(this.object.header.budget),
    };
    const patch = Object.assign({}, {...this.object.header}, reformattedValues);
    this.form.patchValue(patch);
  }

}
