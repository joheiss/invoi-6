import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ReceiversBusinessService} from '../../business-services';
import {MasterComponent} from '../../abstracts/master.component';
import {Receiver, ReceiverSummary} from 'jovisco-domain';

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
