import {TestBed} from '@angular/core/testing';
import {Store} from '@ngrx/store';
import {InvoicingState} from '../store';
import {of} from 'rxjs/index';
import {map, take, tap} from 'rxjs/operators';
import {SelectReceiver} from '../store';
import {ReceiverExistsGuard} from './receiver-exists.guard';
import {mockAllReceivers, mockReceiversEntity} from '../../test/factories/mock-receivers.factory';
import {ReceiverData} from 'jovisco-domain';

describe('Receiver Exists Guard', () => {
  let store: Store<InvoicingState>;
  let guard: ReceiverExistsGuard;

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
        ReceiverExistsGuard
      ]
    });
    store = TestBed.inject(Store);
    guard = TestBed.inject(ReceiverExistsGuard);
  });

  it('should create the guard', () => {
    expect(guard).toBeDefined();
  });

  describe('check if invoice exists', async () => {
    let allReceivers: ReceiverData[];
    let lastReceiver: ReceiverData;

    beforeEach(() => {
      allReceivers = mockAllReceivers();
      lastReceiver = allReceivers[0];
    });

    it('should return true if requested receiver exists', done => {
      const action = new SelectReceiver(lastReceiver);
      const spy = jest.spyOn(store, 'dispatch');
      const id = lastReceiver.id;
      of(mockReceiversEntity())
        .pipe(
          tap(entity => store.dispatch(new SelectReceiver(entity[id]))),
          map(entity => !!entity[id]),
          take(1)
        ).subscribe(exists => {
        expect(exists).toBe(true);
        expect(spy).toHaveBeenCalledWith(action);
        done();
      });
    });

    it('should return false if requested receiver does not exist', done => {
      const action = new SelectReceiver(undefined);
      const spy = jest.spyOn(store, 'dispatch');
      const id = 'not_exists';
      of(mockReceiversEntity())
        .pipe(
          tap(entity => store.dispatch(new SelectReceiver(entity[id]))),
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
