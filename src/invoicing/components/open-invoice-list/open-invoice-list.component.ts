import {ChangeDetectionStrategy, Component, OnChanges} from '@angular/core';
import {MasterListComponent} from '../../abstracts/master-list.component';
import {OpenInvoiceData} from '../../models/open-invoice.model';

@Component({
  selector: 'jo-open-invoice-list',
  templateUrl: './open-invoice-list.component.html',
  styleUrls: ['./open-invoice-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OpenInvoiceListComponent extends MasterListComponent<OpenInvoiceData> implements OnChanges {

  displayedColumns = ['id', 'receiverId', 'receiverName', 'issuedAt', 'billingPeriod', 'netValue', 'paymentAmount', 'dueDate'];

  ngOnChanges() {
    this.dataSource.data = this.objects;
  }

  isPastDue(invoice: any): boolean {
    return invoice.dueDate < new Date();
  }
}
