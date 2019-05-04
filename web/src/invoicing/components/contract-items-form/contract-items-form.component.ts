import {ChangeDetectionStrategy, Component, OnChanges} from '@angular/core';
import {DetailsItemsFormComponent} from '../../abstracts/details-items-form.component';
import {ContractsBusinessService} from '../../business-services';
import {Contract} from 'jovisco-domain';

@Component({
  selector: 'jo-contract-items-form',
  templateUrl: './contract-items-form.component.html',
  styleUrls: ['./contract-items-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContractItemsFormComponent extends DetailsItemsFormComponent<Contract> implements OnChanges {

  constructor(protected service: ContractsBusinessService) {
    super(service);
  }
}
