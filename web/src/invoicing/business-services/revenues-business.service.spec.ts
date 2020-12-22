import {Store} from '@ngrx/store';
import {InvoicingState} from '../store';
import {TestBed} from '@angular/core/testing';
import {cold} from 'jasmine-marbles';
import {RevenuesBusinessService} from './revenues-business.service';
import {map, take} from 'rxjs/operators';
import {of} from 'rxjs/index';
import {mockAllRevenues} from '../../test/factories/mock-revenues.factory';
import {Revenue, RevenueFactory} from 'jovisco-domain';

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
    store = TestBed.inject(Store);
    service = TestBed.inject(RevenuesBusinessService);

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
    const allIRecentRevenues$ = of(mockAllRevenues().map(r => RevenueFactory.fromData(r)));
    allIRecentRevenues$.pipe(
      map(revenues => Revenue.calculateTotalRevenuesPerYear(revenues)),
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
});
