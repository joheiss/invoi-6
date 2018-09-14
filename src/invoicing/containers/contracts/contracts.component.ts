import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Contract} from '../../models/contract.model';
import {ContractSummary} from '../../models/invoicing.model';
import {ContractsBusinessService} from '../../business-services';
import {MasterComponent} from '../../abstracts/master.component';

@Component({
  selector: 'jo-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContractsComponent extends MasterComponent<Contract, ContractSummary> implements OnInit {

  constructor(protected service: ContractsBusinessService) {
    super(service);
  }
}
