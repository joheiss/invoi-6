import {ChangeDetectionStrategy, Component, OnChanges} from '@angular/core';
import {MasterCardComponent} from '../../abstracts/master-card.component';
import {Contract, ContractSummary} from 'jovisco-domain';

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
