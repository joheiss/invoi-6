import {ChangeDetectionStrategy, Component, OnChanges, OnDestroy} from '@angular/core';
import {ContractItem} from '../../models/contract.model';
import {FormControl, Validators} from '@angular/forms';
import * as fromValidators from '../../../shared/validators';
import {I18nUtilityService} from '../../../shared/i18n-utility/i18n-utility.service';
import {DetailsItemFormComponent} from '../../abstracts/details-item-form.component';

@Component({
  selector: 'jo-contract-item-form',
  templateUrl: './contract-item-form.component.html',
  styleUrls: ['./contract-item-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContractItemFormComponent extends DetailsItemFormComponent<ContractItem> implements OnChanges, OnDestroy {

  constructor(protected utility: I18nUtilityService) {
    super(utility);
  }

  protected buildItem(): void {
    this.itemGroup.addControl('id', new FormControl(''));
    this.itemGroup.addControl('description', new FormControl('', Validators.required));
    this.itemGroup.addControl('pricePerUnit', new FormControl('', [Validators.required, Validators.pattern(fromValidators.REGEXP_AMOUNT)]));
    this.itemGroup.addControl('priceUnit', new FormControl('', Validators.required));
    this.itemGroup.addControl('cashDiscountAllowed', new FormControl(''));
    this.isItemGroupBuilt = true;
  }

  protected isImmediateChangeNeeded(fieldName: string): boolean {
    // no immediate changes needed for contract items
    return false;
  }

  protected patchItem() {
    const reformattedValues = {
      pricePerUnit: this.utility.toLocalAmount(this.item.data.pricePerUnit)
    };
    const patch = Object.assign({}, {...this.item.data}, reformattedValues);
    this.itemGroup.patchValue(patch);
  }
}
