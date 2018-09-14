import {Component, OnChanges} from '@angular/core';
import {Contract} from '../../models/contract.model';
import {MasterListComponent} from '../../abstracts/master-list.component';

@Component({
  selector: 'jo-contract-list',
  templateUrl: './contract-list.component.html',
  styleUrls: ['./contract-list.component.scss']
})
export class ContractListComponent extends MasterListComponent<Contract> implements OnChanges {

  displayedColumns = ['id', 'issuedAt', 'description', 'startDate', 'endDate', 'budget'];

}
