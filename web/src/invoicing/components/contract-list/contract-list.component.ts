import {ChangeDetectionStrategy, Component, OnChanges} from '@angular/core';
import {MasterListComponent} from '../../abstracts/master-list.component';
import {Contract} from 'jovisco-domain';

@Component({
  selector: 'jo-contract-list',
  templateUrl: './contract-list.component.html',
  styleUrls: ['./contract-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContractListComponent extends MasterListComponent<Contract> implements OnChanges {

  displayedColumns = ['id', 'issuedAt', 'description', 'startDate', 'endDate', 'budget'];

  getShortenedDescription(description): string {
    const length = description.length;
    return length > 20 ? description.substring(0, 20) + '...' : description;
  }
}
