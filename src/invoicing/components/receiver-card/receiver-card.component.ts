import {ChangeDetectionStrategy, Component, OnChanges} from '@angular/core';
import {Receiver} from '../../models/receiver.model';
import {ReceiverSummary} from '../../models/invoicing.model';
import {MasterCardComponent} from '../../abstracts/master-card.component';

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
