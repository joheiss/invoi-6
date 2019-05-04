import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {RevenuesBusinessService} from '../../business-services';
import {Observable} from 'rxjs/index';
import {RevenuePerYearData, OpenInvoiceData} from 'jovisco-domain';

@Component({
  selector: 'jo-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
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
