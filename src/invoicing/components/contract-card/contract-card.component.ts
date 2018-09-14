import {ChangeDetectionStrategy, Component, OnChanges, SimpleChanges} from '@angular/core';
import {ContractSummary} from '../../models/invoicing.model';
import {Contract} from '../../models/contract.model';
import {MasterCardComponent} from '../../abstracts/master-card.component';

@Component({
  selector: 'jo-contract-card',
  templateUrl: './contract-card.component.html',
  styleUrls: ['./contract-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContractCardComponent extends MasterCardComponent<Contract, ContractSummary> implements OnChanges {

  constructor() {
    super();
  }
}
