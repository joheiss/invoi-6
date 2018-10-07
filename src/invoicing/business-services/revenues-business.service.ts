import {Injectable} from '@angular/core';
import * as fromStore from '../store';
import {Observable} from 'rxjs/index';
import {select, Store} from '@ngrx/store';
import {RevenuePerYearData} from '../models/revenue.model';
import {map} from 'rxjs/operators';
import {OpenInvoiceData} from '../models/open-invoice.model';
import {Invoice, InvoiceData} from '../models/invoice.model';
import {DateUtilities} from '../../shared/utilities/date-utilities';

@Injectable()
export class RevenuesBusinessService {

  private currentYear = new Date().getFullYear();

  constructor(private store: Store<fromStore.InvoicingState>) {
  }

  calculateTotalRevenues(): Observable<RevenuePerYearData[]> {
    // get all invoices in store
    const revenues = this.initializeRevenuesPerYear();
    return this.store.pipe(
      select(fromStore.selectAllInvoices),
      map(invoices => {
        invoices
          .filter(inv => this.isRecentInvoice(inv))
          .map(inv => {
            const revenueDate = this.calculateRevenueDate(inv);
            const invoice = Invoice.createFromData(inv);
            const iy = this.calculateIndexOfRevenueYear(revenueDate.getFullYear());
            const im = revenueDate.getMonth();
            revenues[iy].revenuePerMonth[im] = revenues[iy].revenuePerMonth[im] + invoice.netValue;
            revenues[iy].revenuePerYear = revenues[iy].revenuePerYear + invoice.netValue;
            return revenues;
          });
        return revenues;
      }));
  }

  selectOpenInvoices(): Observable<OpenInvoiceData[]> {
    return this.store.pipe(select(fromStore.selectAllOpenInvoicesWithReceiver));
  }

  private calculateIndexOfRevenueYear(year: number): number {
    return year - this.currentYear;
  }

  private calculateRevenueDate(invoice: InvoiceData): Date {
    return DateUtilities.subtractDaysToDate(invoice.issuedAt, 14);
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

  private isRecentInvoice(invoice: InvoiceData): boolean {
    return this.calculateRevenueDate(invoice).getFullYear() > this.currentYear - 3;
  }

}
