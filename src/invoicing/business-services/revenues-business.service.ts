import {Injectable} from '@angular/core';
import * as fromStore from '../store';
import {Observable} from 'rxjs/index';
import {select, Store} from '@ngrx/store';
import {RevenueData, RevenuePerYearData} from '../models/revenue.model';
import {map, take} from 'rxjs/operators';
import {OpenInvoiceData} from '../models/open-invoice.model';

@Injectable()
export class RevenuesBusinessService {

  private currentYear = new Date().getFullYear();

  constructor(private store: Store<fromStore.InvoicingState>) {
  }

  queryRevenues(): Observable<RevenueData[]> {
    return this.store.pipe(select(fromStore.selectAllRevenues));
  }

  queryRecentRevenues(): Observable<RevenueData[]> {
    return this.store.pipe(select(fromStore.selectAllRevenues))
      .pipe(
        map(revs => revs.filter((rev, index) => index <= 2)),
      );
  }

  calculateTotalRevenues(): Observable<RevenuePerYearData[]> {
    const revenuesMatrix = this.initializeRevenuesPerYear();
    return this.store.pipe(
      select(fromStore.selectAllRecentRevenuesAsObjArray),
      map(revenues => {
        revenues.map(r => {
          const i = this.calculateIndexOfRevenueYear(+r.year);
          revenuesMatrix[i].revenuePerYear = r.totalRevenue;
          r.revenueInMonths.map((m, j) => revenuesMatrix[i].revenuePerMonth[j] = m);
          return revenuesMatrix;
        });
        return revenuesMatrix;
      }),
      take(1));
  }

  selectOpenInvoices(): Observable<OpenInvoiceData[]> {
    return this.store.pipe(select(fromStore.selectAllOpenInvoicesWithReceiver));
  }

  private calculateIndexOfRevenueYear(year: number): number {
    return this.currentYear - year;
  }

  private initializeRevenuesPerYear(): RevenuePerYearData[] {
    const revenuesPerYear = [] as RevenuePerYearData[];
    for (let i = 0; i < 3; i++) {
      const revenuePerYear: RevenuePerYearData = {
        year: this.currentYear - i,
        revenuePerMonth: new Array(12).fill(0),
        revenuePerYear: 0
      };
      revenuesPerYear.push(revenuePerYear);
    }
    return revenuesPerYear;
  }
}
