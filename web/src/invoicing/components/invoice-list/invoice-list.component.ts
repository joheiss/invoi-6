import {ChangeDetectionStrategy, Component, OnChanges} from '@angular/core';
import {MasterListComponent} from '../../abstracts/master-list.component';
import {Invoice} from 'jovisco-domain';

@Component({
  selector: 'jo-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoiceListComponent extends MasterListComponent<Invoice> implements OnChanges {

  displayedColumns = ['id', 'issuedAt', 'billingPeriod', 'netValue', 'paymentAmount', 'dueDate'];

  ngOnChanges() {
    this.dataSource.data = this.objects;
  }

  isPastDue(invoice: Invoice): boolean {
    return !invoice.isPaid() && invoice.dueDate < new Date();
  }
}
