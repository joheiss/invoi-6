import {Component, OnInit} from '@angular/core';
import {RevenuesBusinessService} from '../../business-services';
import {RevenuePerYearData} from '../../models/revenue.model';
import {Observable} from 'rxjs/index';
import {OpenInvoiceData} from '../../models/open-invoice.model';

@Component({
  selector: 'jo-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  revenues$: Observable<RevenuePerYearData[]>;
  openInvoices$: Observable<OpenInvoiceData[]>;

  constructor(private revenuesBusinessService: RevenuesBusinessService) { }

  ngOnInit() {
    this.revenues$ = this.revenuesBusinessService.calculateTotalRevenues();
    this.openInvoices$ = this.revenuesBusinessService.selectOpenInvoices();
  }

}
