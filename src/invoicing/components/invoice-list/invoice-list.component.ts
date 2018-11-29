import {ChangeDetectionStrategy, Component, OnChanges} from '@angular/core';
import {Invoice} from '../../models/invoice.model';
import {MasterListComponent} from '../../abstracts/master-list.component';

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
