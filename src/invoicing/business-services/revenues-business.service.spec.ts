import {Store} from '@ngrx/store';
import {InvoicingState} from '../store/reducers';
import {TestBed} from '@angular/core/testing';
import {cold} from 'jasmine-marbles';
import {RevenuesBusinessService} from './revenues-business.service';
import {RevenuePerYearData} from '../models/revenue.model';
import {generateInvoiceData} from '../../test/test-generators';
import {Invoice, InvoiceData, InvoiceStatus} from '../models/invoice.model';
import {BillingMethod, PaymentMethod} from '../models/invoicing.model';
import {map, take} from 'rxjs/operators';
import {of} from 'rxjs/index';

describe('Revenues Business Service', () => {

  let store: Store<InvoicingState>;
  let service: RevenuesBusinessService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Store,
          useValue: {
            dispatch: jest.fn(),
            pipe: jest.fn(() => cold('-b|', {b: true}))
          }
        },
        RevenuesBusinessService
      ]
    });
    store = TestBed.get(Store);
    service = TestBed.get(RevenuesBusinessService);

    // Mock implementation of console.error to
    // return undefined to stop printing out to console log during test
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  beforeEach(() => {
    service['currentYear'] = new Date().getFullYear();
  });

  it('should create the service', async () => {
    expect(service).toBeDefined();
  });

  it('should calculate the revenues of the last 3 calendar years - including current year', done => {
    const allInvoices = mockAllInvoices();
    const allInvoices$ = of(allInvoices);

    const revenues = service['initializeRevenuesPerYear']();
    allInvoices$.pipe(
      map(invoices => {
        invoices
          .filter(inv => service['isRecentInvoice'](inv))
          .map(inv => {
            const revenueDate = service['calculateRevenueDate'](inv);
            const invoice = Invoice.createFromData(inv);
            const iy = service['calculateIndexOfRevenueYear'](revenueDate.getFullYear());
            const im = revenueDate.getMonth();
            revenues[iy].revenuePerMonth[im] = revenues[iy].revenuePerMonth[im] + invoice.netValue;
            revenues[iy].revenuePerYear = revenues[iy].revenuePerYear + invoice.netValue;
            return revenues;
          });
        return revenues;
      }),
      take(1)
    ).subscribe(matrix => {
      expect(matrix.length).toBe(3);
      expect(matrix[0].revenuePerMonth.length).toBe(12);
      expect(matrix[0].revenuePerYear).toBeGreaterThanOrEqual(new Date().getMonth());
      expect(matrix[1].revenuePerMonth.length).toBe(12);
      expect(matrix[1].revenuePerYear).toBe(12);
      expect(matrix[1].revenuePerMonth).toEqual([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
      expect(matrix[2].revenuePerMonth.length).toBe(12);
      expect(matrix[2].revenuePerYear).toBe(12);
      expect(matrix[2].revenuePerMonth).toEqual([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
      done();
    });
  });

  it('should invoke store selector if selectOpenInvoices is processed', async () => {
    const spy = jest.spyOn(store, 'pipe');
    service.selectOpenInvoices();
    return expect(spy).toHaveBeenCalled();
  });

  it('should return zero-based index of year', async () => {
    expect(service['calculateIndexOfRevenueYear'](service['currentYear'] - 1)).toBe(1);
  });

  it('should return the revenue date which is 14 days before the invoice issue date', async () => {
    const invoiceData = generateInvoiceData();
    invoiceData.issuedAt = new Date(2018, 0, 7);
    expect(service['calculateRevenueDate'](invoiceData)).toEqual(new Date(2017, 11, 24));
  });

  it('should initialize the revenues matrix for the recent 3 years', () => {
    /* so far this is pretty useless */
    const matrix: RevenuePerYearData[] = [
      {year: service['currentYear'], revenuePerMonth: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], revenuePerYear: 0},
      {year: service['currentYear'] - 1, revenuePerMonth: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], revenuePerYear: 0},
      {year: service['currentYear'] - 2, revenuePerMonth: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], revenuePerYear: 0}
    ];
    expect(service['initializeRevenuesPerYear']()).toEqual(matrix);
  });

  it('should detect if an invoice belongs to a year which is relevant for the revenue matrix', async () => {
    const invoiceData = generateInvoiceData();
    expect(service['isRecentInvoice'](invoiceData)).toBeTruthy();
    const longPastYear = new Date().getFullYear() - 4;
    invoiceData.issuedAt = new Date(longPastYear, 11, 31);
    expect(service['isRecentInvoice'](invoiceData)).toBeFalsy();
  });

  it('should generate invoices for the last 5 years', () => {
    const allInvoices = mockAllInvoices();
    expect(allInvoices.length).toBeGreaterThanOrEqual(48);
    expect(allInvoices.length).toBeLessThanOrEqual(60);
  });
});

const mockAllInvoices = (): InvoiceData[] => {

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const allInvoices: InvoiceData[] = [];

  let issuedAtYear = currentYear, issuedAtMonth = currentMonth;
  let issuedAt: Date;
  let id = 5900;
  // -- base invoice data
  const baseInvoiceData: InvoiceData = {
    id: 'to be generated',
    issuedAt: today,
    objectType: 'invoices',
    organization: 'THQ',
    status: InvoiceStatus.created,
    receiverId: '1901',
    contractId: '4901',
    paymentTerms: '30 Tage: 3 % Skonto; 60 Tage: netto',
    paymentMethod: PaymentMethod.BankTransfer,
    billingMethod: BillingMethod.Invoice,
    billingPeriod: 'will be generated',
    cashDiscountDays: 30,
    cashDiscountPercentage: 3.0,
    dueInDays: 60,
    currency: 'EUR',
    vatPercentage: 19.0,
    invoiceText: 'Dieser Text wird auf der Rechnung gedruckt.',
    internalText: 'Dieser Text ist für interne Zwecke.',
    items: [
      {
        id: 1, contractItemId: 1, description: 'Arbeitstage im Projekt T/E/S/T', pricePerUnit: 1.00,
        quantity: 1.0, quantityUnit: 'Tage', cashDiscountAllowed: true, vatPercentage: 19.0
      }
    ]
  };
  // --- invoices for the past 4 years
  for (let i = 4; i >= 0; i--) {
    issuedAtYear = currentYear - i;
    for (let j = 0; j < 12; j++) {
      issuedAtMonth = j;
      issuedAt = new Date(issuedAtYear, issuedAtMonth, 15);
      if (issuedAt < today) {
        id++;
        const invoiceData = {
          ...baseInvoiceData,
          id: id.toString(), issuedAt: issuedAt, billingPeriod: `${issuedAtYear.toString()} - ${(issuedAtMonth + 1).toString()}`
        };
        allInvoices.push(invoiceData);
      }
    }
  }
  return allInvoices;
};
