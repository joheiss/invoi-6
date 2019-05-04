import {ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {I18nUtilityService} from '../../../shared/i18n-utility/i18n-utility.service';
import * as fromValidators from '../../../shared/validators';
import {DetailsItemFormComponent} from '../../abstracts/details-item-form.component';
import {Contract, InvoiceItem} from 'jovisco-domain';

@Component({
  selector: 'jo-invoice-item-form',
  templateUrl: './invoice-item-form.component.html',
  styleUrls: ['./invoice-item-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoiceItemFormComponent extends DetailsItemFormComponent<InvoiceItem> implements OnChanges, OnDestroy {
  @Input() contract: Contract;
  @Input() isChangeable: boolean;
  @Input() mode: string;

  constructor(protected utility: I18nUtilityService) {
    super(utility);
  }

  protected buildItem(): void {
    this.itemGroup.addControl('id', new FormControl(''));
    this.itemGroup.addControl('contractItemId', new FormControl('', Validators.required));
    this.itemGroup.addControl('description', new FormControl('', Validators.required));
    this.itemGroup.addControl('quantity', new FormControl('', [Validators.required, Validators.pattern(fromValidators.REGEXP_AMOUNT)]));
    this.itemGroup.addControl('quantityUnit', new FormControl('', Validators.required));
    this.itemGroup.addControl('pricePerUnit', new FormControl('', [Validators.required, Validators.pattern(fromValidators.REGEXP_AMOUNT)]));
    this.itemGroup.addControl('netValue', new FormControl({ value: '', disabled: true }));
    this.itemGroup.addControl('cashDiscountAllowed', new FormControl(''));
    this.isItemGroupBuilt = true;
  }

  protected isImmediateChangeNeeded(fieldName: string): boolean {
    return fieldName === 'contractItemId' ||
           fieldName === 'quantity' ||
           fieldName === 'pricePerUnit' ||
           fieldName === 'cashDiscountAllowed';
  }

  protected patchItem() {
    const reformattedValues = {
      quantity: this.utility.toLocalAmount(this.item.quantity),
      pricePerUnit: this.utility.toLocalAmount(this.item.pricePerUnit),
      netValue: this.utility.toLocalAmount(this.item.netValue)
    };
    const patch = Object.assign({}, {...this.item.data}, reformattedValues);
    this.itemGroup.patchValue(patch);
  }
}
