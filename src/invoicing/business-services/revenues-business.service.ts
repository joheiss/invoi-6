import {Injectable} from '@angular/core';
import * as fromStore from '../store';
import {Observable} from 'rxjs/Observable';
import {Store} from '@ngrx/store';
import {RevenueData} from '../models/revenue.model';
import {map} from 'rxjs/operators';
import {OpenInvoiceData} from '../models/open-invoice.model';

@Injectable()
export class RevenuesBusinessService {

  constructor(private store: Store<fromStore.InvoicingState>) {}

  queryRevenues(): Observable<RevenueData[]> {
    return this.store.select(fromStore.selectAllRevenues);
  }

  queryRecentRevenues(): Observable<RevenueData[]> {
    return this.store.select(fromStore.selectAllRevenues)
      .pipe(
        map(revs => revs.filter((rev, index) => index <= 2)),
      );
  }

  queryOpenInvoices(): Observable<OpenInvoiceData[]> {
    return this.store.select(fromStore.selectAllOpenInvoices);
  }
}
