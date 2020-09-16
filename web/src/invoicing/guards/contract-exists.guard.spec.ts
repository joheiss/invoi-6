import {TestBed} from '@angular/core/testing';
import {Store} from '@ngrx/store';
import {InvoicingState} from '../store/reducers';
import {ContractExistsGuard} from './contract-exists.guard';
import {of} from 'rxjs/index';
import {map, take, tap} from 'rxjs/operators';
import {SelectContract} from '../store';
import {mockContractsEntity, mockSingleContract} from '../../test/factories/mock-contracts.factory';

describe('Contract Exists Guard', () => {
  let store: Store<InvoicingState>;
  let guard: ContractExistsGuard;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        {
          provide: Store,
          useValue: {
            dispatch: jest.fn(),
            pipe: jest.fn()
          },
        },
        ContractExistsGuard
      ]
    });
    store = TestBed.get(Store);
    guard = TestBed.get(ContractExistsGuard);
  });

  it('should create the guard', () => {
    expect(guard).toBeDefined();
  });

  describe('check if contract exists', async () => {

    it('should return true if requested object exists', done => {
      const action = new SelectContract(mockSingleContract());
      const spy = jest.spyOn(store, 'dispatch');
      const id = '4909';
      of(mockContractsEntity())
        .pipe(
          tap(entity => store.dispatch(new SelectContract(entity[id]))),
          map(entity => !!entity[id]),
          take(1)
        ).subscribe(exists => {
        expect(exists).toBe(true);
        expect(spy).toHaveBeenCalledWith(action);
        done();
      });
    });

    it('should return false if requested object does not exist', done => {
      const action = new SelectContract(undefined);
      const spy = jest.spyOn(store, 'dispatch');
      const id = 'not_exists';
      of(mockContractsEntity())
        .pipe(
          tap(entity => store.dispatch(new SelectContract(entity[id]))),
          map(entity => !!entity[id]),
          take(1)
        ).subscribe(exists => {
        expect(exists).toBe(false);
        expect(spy).toHaveBeenCalledWith(action);
        done();
      });
    });
  });
});
