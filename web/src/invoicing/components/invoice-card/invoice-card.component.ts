import {ChangeDetectionStrategy, Component, OnChanges} from '@angular/core';
import {MasterCardComponent} from '../../abstracts/master-card.component';
import {Invoice, InvoiceSummary} from 'jovisco-domain';

@Component({
  selector: 'jo-invoice-card',
  templateUrl: './invoice-card.component.html',
  styleUrls: ['./invoice-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoiceCardComponent extends MasterCardComponent<Invoice, InvoiceSummary> implements OnChanges {

  constructor() {
    super();
  }
}
