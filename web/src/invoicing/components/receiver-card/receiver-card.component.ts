import {ChangeDetectionStrategy, Component, OnChanges} from '@angular/core';
import {MasterCardComponent} from '../../abstracts/master-card.component';
import {Receiver, ReceiverSummary} from 'jovisco-domain';

@Component({
  selector: 'jo-receiver-card',
  templateUrl: './receiver-card.component.html',
  styleUrls: ['./receiver-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReceiverCardComponent extends MasterCardComponent<Receiver, ReceiverSummary> implements OnChanges {

  constructor() {
    super();
  }
}
