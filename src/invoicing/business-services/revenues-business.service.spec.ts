import {Store} from '@ngrx/store';
import {InvoicingState} from '../store/reducers';
import {TestBed} from '@angular/core/testing';
import {cold} from 'jasmine-marbles';
import {RevenuesBusinessService} from './revenues-business.service';
import {Revenue, RevenuePerYearData} from '../models/revenue.model';
import {map, take} from 'rxjs/operators';
import {of} from 'rxjs/index';
import {mockSingleInvoice} from '../../test/factories/mock-invoices.factory';
import {mockAllRevenues} from '../../test/factories/mock-revenues.factory';

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
    const allIRecentRevenues$ = of(mockAllRevenues().map(r => Revenue.createFromData(r)));
    const revenuesMatrix = service['initializeRevenuesPerYear']();
    allIRecentRevenues$.pipe(
      map(revenues => {
        revenues.map(r => {
          const i = service['calculateIndexOfRevenueYear'](+r.year);
          revenuesMatrix[i].revenuePerYear = r.totalRevenue;
          r.revenueInMonths.map((m, j) => revenuesMatrix[i].revenuePerMonth[j] = m);
          return revenuesMatrix;
        });
        return revenuesMatrix;
      }),
      take(1)
    ).subscribe(matrix => {
      expect(matrix.length).toBe(3);
      expect(matrix[0].revenuePerMonth.length).toBe(12);
      expect(matrix[0].revenuePerYear).toBeGreaterThanOrEqual(new Date().getMonth());
      expect(matrix[1].revenuePerMonth.length).toBe(12);
      expect(matrix[1].revenuePerYear).toBe(24);
      expect(matrix[1].revenuePerMonth).toEqual([2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]);
      expect(matrix[2].revenuePerMonth.length).toBe(12);
      expect(matrix[2].revenuePerYear).toBe(24);
      expect(matrix[2].revenuePerMonth).toEqual([2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]);
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

  it('should initialize the revenues matrix for the recent 3 years', () => {
    /* so far this is pretty useless */
    const matrix: RevenuePerYearData[] = [
      {year: service['currentYear'], revenuePerMonth: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], revenuePerYear: 0},
      {year: service['currentYear'] - 1, revenuePerMonth: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], revenuePerYear: 0},
      {year: service['currentYear'] - 2, revenuePerMonth: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], revenuePerYear: 0}
    ];
    expect(service['initializeRevenuesPerYear']()).toEqual(matrix);
  });
});
