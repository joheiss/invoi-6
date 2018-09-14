import {Component, OnInit} from '@angular/core';
import {RevenuesBusinessService} from '../../business-services';
import {Revenue, RevenueData} from '../../models/revenue.model';
import {Observable} from 'rxjs/Observable';
import {OpenInvoiceData} from '../../models/open-invoice.model';

@Component({
  selector: 'jo-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  revenues$: Observable<RevenueData[]>;
  openInvoices$: Observable<OpenInvoiceData[]>;

  constructor(private revenuesBusinessService: RevenuesBusinessService) { }

  ngOnInit() {
    this.revenues$ = this.revenuesBusinessService.queryRecentRevenues();
    this.openInvoices$ = this.revenuesBusinessService.queryOpenInvoices();
  }

  getHeaderLine(): string[] {
    const monthNames = ['Jan', 'Feb', 'Mrz', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
    return [
      'Jahr',
      ...monthNames,
      'Summe'
    ];
  }

  getMonths(data: RevenueData): number[] {
    const revenue = Revenue.createFromData(data);
    const revs = revenue.revenueInMonths;
    revs.push(revenue.totalRevenue);
    return revs;
  }
}
