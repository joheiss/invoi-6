import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ReceiverSummary} from '../../models/invoicing.model';
import {Receiver} from '../../models/receiver.model';
import {ReceiversBusinessService} from '../../business-services/receivers-business.service';
import {MasterComponent} from '../../abstracts/master.component';

@Component({
  selector: 'jo-receivers',
  templateUrl: './receivers.component.html',
  styleUrls: ['./receivers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReceiversComponent extends MasterComponent<Receiver, ReceiverSummary> implements OnInit {

  constructor(protected service: ReceiversBusinessService) {
    super(service);
  }
}
