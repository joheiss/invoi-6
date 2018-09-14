import {ChangeDetectionStrategy, Component, OnChanges, SimpleChanges} from '@angular/core';
import {InvoiceSummary} from '../../models/invoicing.model';
import {Invoice} from '../../models/invoice.model';
import {MasterCardComponent} from '../../abstracts/master-card.component';

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
