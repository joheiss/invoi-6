import {TestBed} from '@angular/core/testing';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../app/store/reducers';
import {cold} from 'jasmine-marbles';
import {RouterTestingModule} from '@angular/router/testing';
import {catchError, filter, switchMap, take, tap} from 'rxjs/operators';
import {of} from 'rxjs/internal/observable/of';
import {ContractsGuard} from './contracts.guard';
import {mockInvoicingState} from '../../test/factories/mock-invoicing-state.factory';

describe('Objects Guard', () => {
  let store: Store<AppState>;
  let guard: ContractsGuard;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        {
          provide: Store,
          useValue: {
            dispatch: jest.fn(),
            pipe: jest.fn()
          },
        },
        ContractsGuard
      ]
    });
    store = TestBed.get(Store);
    guard = TestBed.get(ContractsGuard);

    // Mock implementation of console.error to return undefined to stop printing out to console log during test
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  it('should create the guard', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', async () => {

    it('should return true if objects are loaded', async () => {
      const state = mockInvoicingState();
      const outcome = cold('-(a|)', {a: state});
      const spy = jest.spyOn(store, 'dispatch');
      const action = guard['getQueryAction']();
      store.pipe = jest.fn(() => outcome.pipe(
        select(guard['getObjectLoadedSelector']()),
        tap(loaded => !loaded && store.dispatch(guard['getQueryAction']())),
        filter(loaded => loaded),
        take(1)
      ).pipe(
          switchMap(() => of(true)),
          catchError(() => of(false))
      ));
      const expected = cold('-(b|)', {b: true});
      await expect(guard.canActivate()).toBeObservable(expected);
      return expect(spy).not.toHaveBeenCalledWith(action);
    });

  });

  describe('checkStore', () => {

    it('should return true if objects are loaded', async (done) => {
      const spy = jest.spyOn(store, 'dispatch');
      // @ts-ignore
      const action = guard.getQueryAction();
      of(true).pipe(
        // @ts-ignore
        tap(loaded => !loaded && store.dispatch(guard.getQueryAction())),
        filter(loaded => loaded),
        take(1)
      ).subscribe(res => {
        expect(res).toBe(true);
        expect(spy).not.toHaveBeenCalledWith(action);
        done();
      });
    });

    it('should dispatch object query action if objects are not yet loaded', async (done) => {
      const spy = jest.spyOn(store, 'dispatch');
      // @ts-ignore
      const action = guard.getQueryAction();
      of(false).pipe(
        // @ts-ignore
        tap(loaded => !loaded && store.dispatch(guard.getQueryAction())),
        tap(loaded => {
          if (!loaded) {
            expect(loaded).toBe(false);
            expect(spy).toHaveBeenCalledWith(action);
            done();
          }
        }),
        filter(loaded => loaded),
        take(1)
      ).subscribe(res => {
        expect(res).toBe(false);
        expect(spy).toHaveBeenCalledWith(action);
        done();
      });
    });
  });
});
