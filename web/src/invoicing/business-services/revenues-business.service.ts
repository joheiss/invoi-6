import {Injectable} from '@angular/core';
import * as fromStore from '../store';
import {Observable} from 'rxjs/index';
import {select, Store} from '@ngrx/store';
import {map} from 'rxjs/operators';
import {OpenInvoiceData, Revenue, RevenuePerYearData} from 'jovisco-domain';

@Injectable()
export class RevenuesBusinessService {

  constructor(private store: Store<fromStore.InvoicingState>) {
  }

  calculateTotalRevenues(): Observable<RevenuePerYearData[]> {
    return this.store.pipe(
      select(fromStore.selectAllRecentRevenuesAsObjArray),
      map(revenues => Revenue.calculateTotalRevenuesPerYear(revenues))
    );
  }

  selectOpenInvoices(): Observable<OpenInvoiceData[]> {
    return this.store.pipe(select(fromStore.selectAllOpenInvoicesWithReceiver));
  }
}
