import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {InvoicesBusinessService} from '../../business-services';
import {MasterComponent} from '../../abstracts/master.component';
import {Invoice, InvoiceSummary} from 'jovisco-domain';

@Component({
  selector: 'jo-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoicesComponent extends MasterComponent<Invoice, InvoiceSummary> implements OnInit {

  constructor(protected service: InvoicesBusinessService) {
    super(service);
  }
}
