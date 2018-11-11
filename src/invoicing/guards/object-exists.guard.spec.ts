import {TestBed} from '@angular/core/testing';
import {Store} from '@ngrx/store';
import {cold} from 'jasmine-marbles';
import {RouterTestingModule} from '@angular/router/testing';
import {InvoicingState} from '../store/reducers';
import {ContractExistsGuard} from './contract-exists.guard';
import {ActivatedRoute} from '@angular/router';
import {combineLatest, of} from 'rxjs/index';
import {catchError, filter, map, switchMap, take, tap} from 'rxjs/operators';
import * as fromStore from '../store';
import {QueryContracts, QueryDocumentLinksForObject, QueryInvoices, QueryNumberRanges, QueryReceivers} from '../store';

describe('Object Exists Guard', () => {
  let store: Store<InvoicingState>;
  let guard: ContractExistsGuard;
  let route: ActivatedRoute;

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
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: {
                id: '4909'
              }
            }
          }
        },
        ContractExistsGuard
      ]
    });
    store = TestBed.get(Store);
    guard = TestBed.get(ContractExistsGuard);
    route = TestBed.get(ActivatedRoute);

    // Mock implementation of console.error to return undefined to stop printing out to console log during test
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  it('should create the guard', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', async () => {

    it('should return true if objects are loaded and requested object exists', async () => {
      guard['checkStore'] = jest.fn(() => cold('-(a|)', {a: true}));
      guard['hasObject'] = jest.fn(() => cold('-(a|)', {a: true}));
      let expected = cold('-(a|)', {a: true});
      expect(guard['checkStore'](route.snapshot)).toBeObservable(expected);
      expected = cold('--(a|)', {a: true});
      expect(guard['hasObject'](route.snapshot.params.id)).toBeObservable(expected);

      guard['checkStore'](route.snapshot)
        .pipe(
          take(1),
          switchMap(() => {
            if (route.snapshot.params.id === 'copy' || route.snapshot.params.id === 'new' || route.snapshot.params.id === 'quick') {
              return of(true);
            }
            return guard['hasObject'](route.snapshot.params.id);
          }),
          catchError((err, caught) => {
            console.error(err, caught);
            return of(false);
          })
        ).subscribe(res => expect(res).toBeObservable(expected));
    });
  });

  describe('If object id is provided in URL params', () => {

    it('should return true if objects are loaded and requested object exists', async () => {
      route.snapshot.params.id = '4909';
      guard['checkStore'] = jest.fn(() => cold('-(a|)', {a: true}));
      guard['hasObject'] = jest.fn(() => cold('-(a|)', {a: true}));
      const expected = cold('--(a|)', {a: true});
      expect(guard.canActivate(route.snapshot)).toBeObservable(expected);
    });

    it('should return false if objects are loaded and requested object does not exist', async () => {
      route.snapshot.params.id = '4909';
      guard['checkStore'] = jest.fn(() => cold('-(a|)', {a: true}));
      guard['hasObject'] = jest.fn(() => cold('-(a|)', {a: false}));
      const expected = cold('--(a|)', {a: false});
      expect(guard.canActivate(route.snapshot)).toBeObservable(expected);
    });

  });

  describe('If copy, new or quick command is provided in URL params', () => {

    it('should return true if objects are loaded and requested object does not exist - in case of new', async () => {
      route.snapshot.params.id = 'new';
      guard['checkStore'] = jest.fn(() => cold('-(a|)', {a: true}));
      guard['hasObject'] = jest.fn(() => cold('-(a|)', {a: false}));
      const expected = cold('-(a|)', {a: true});
      expect(guard.canActivate(route.snapshot)).toBeObservable(expected);
    });

    it('should return true if objects are loaded and requested object does not exist - in case of copy', async () => {
      route.snapshot.params.id = 'copy';
      guard['checkStore'] = jest.fn(() => cold('-(a|)', {a: true}));
      guard['hasObject'] = jest.fn(() => cold('-(a|)', {a: false}));
      const expected = cold('-(a|)', {a: true});
      expect(guard.canActivate(route.snapshot)).toBeObservable(expected);
    });

    it('should return true if objects are loaded and requested object does not exist - in case of quick', async () => {
      route.snapshot.params.id = 'quick';
      guard['checkStore'] = jest.fn(() => cold('-(a|)', {a: true}));
      guard['hasObject'] = jest.fn(() => cold('-(a|)', {a: false}));
      const expected = cold('-(a|)', {a: true});
      expect(guard.canActivate(route.snapshot)).toBeObservable(expected);
    });
  });

  describe('checkStore', async () => {

    it('should dispatch object queries in case objects are not yet loaded', async () => {
      const spy = jest.spyOn(store, 'dispatch');
      const action1 = new QueryNumberRanges();
      const action2 = new QueryContracts();
      const action3 = new QueryReceivers();
      const action4 = new QueryInvoices();
      const action5 = new QueryDocumentLinksForObject({objectType: 'contracts', id: '4909'});
      const loadingStates = [
        [of(false), of(false), of(false), of(false)],
        [of(true), of(false), of(false), of(false)],
        [of(true), of(true), of(false), of(false)],
        [of(true), of(true), of(true), of(true)],
      ];
      loadingStates.forEach((ls, ix) => {
        combineLatest(ls)
          .pipe(
            tap(results => {
              if (!results[0]) {
                store.dispatch(new fromStore.QueryNumberRanges());
              }
              if (!results[1]) {
                store.dispatch(new fromStore.QueryContracts());
              }
              if (!results[2]) {
                store.dispatch(new fromStore.QueryReceivers());
              }
              if (!results[3]) {
                store.dispatch(new fromStore.QueryInvoices());
              }
              store.dispatch(new fromStore.QueryDocumentLinksForObject({objectType: 'contracts', id: route.snapshot.params.id}));
            }),
            map(([numberRangesLoaded,
                   contractsLoaded,
                   receiversLoaded,
                   invoicesLoaded]) =>
              numberRangesLoaded && contractsLoaded && receiversLoaded && invoicesLoaded),
            filter(loaded => loaded),
            take(1)
          ).subscribe(res => {
          switch (ix) {
            case 0:
              expect(res).toBeFalsy();
              expect(spy).toHaveBeenCalledWith(action1);
              expect(spy).toHaveBeenCalledWith(action2);
              expect(spy).toHaveBeenCalledWith(action3);
              expect(spy).toHaveBeenCalledWith(action4);
              expect(spy).toHaveBeenCalledWith(action5);
              break;
            case 1:
              expect(res).toBeFalsy();
              expect(spy).not.toHaveBeenCalledWith(action1);
              expect(spy).toHaveBeenCalledWith(action2);
              expect(spy).toHaveBeenCalledWith(action3);
              expect(spy).toHaveBeenCalledWith(action4);
              expect(spy).toHaveBeenCalledWith(action5);
              break;
            case 2:
              expect(res).toBeFalsy();
              expect(spy).not.toHaveBeenCalledWith(action1);
              expect(spy).not.toHaveBeenCalledWith(action2);
              expect(spy).toHaveBeenCalledWith(action3);
              expect(spy).toHaveBeenCalledWith(action4);
              expect(spy).toHaveBeenCalledWith(action5);
              break;
            case 3:
              expect(res).toBeFalsy();
              expect(spy).not.toHaveBeenCalledWith(action1);
              expect(spy).not.toHaveBeenCalledWith(action2);
              expect(spy).not.toHaveBeenCalledWith(action3);
              expect(spy).toHaveBeenCalledWith(action4);
              expect(spy).toHaveBeenCalledWith(action5);
              break;
            case 4:
              expect(res).toBeTruthy();
              expect(spy).not.toHaveBeenCalledWith(action1);
              expect(spy).not.toHaveBeenCalledWith(action2);
              expect(spy).not.toHaveBeenCalledWith(action3);
              expect(spy).not.toHaveBeenCalledWith(action4);
              expect(spy).toHaveBeenCalledWith(action5);
          }
        });
      });
    });
  });
});
