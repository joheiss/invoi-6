import {TestBed} from '@angular/core/testing';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../app/store';
import {cold} from 'jasmine-marbles';
import {RouterTestingModule} from '@angular/router/testing';
import {catchError, filter, switchMap, take, tap} from 'rxjs/operators';
import {of} from 'rxjs/internal/observable/of';
import {UsersGuard} from './users.guard';
import {mockIdState, mockIdStateWithOnlyAuthUser} from '../../test/factories/mock-id-state.factory';

describe('Users Guard', () => {
  let store: Store<AppState>;
  let guard: UsersGuard;

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
        UsersGuard
      ]
    });
    store = TestBed.inject(Store);
    guard = TestBed.inject(UsersGuard);

    // Mock implementation of console.error to return undefined to stop printing out to console log during test
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  it('should create the guard', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', async () => {
    it('should return true if users are loaded', async () => {
      const idState = mockIdState();
      const outcome = cold('-(a|)', {a: idState});
      const spy = jest.spyOn(store, 'dispatch');
      const action = guard['getQueryAction']();
      // @ts-ignore
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

    it('should dispatch QueryUsers action if users are not yet loaded', async () => {
      const idState = mockIdStateWithOnlyAuthUser();
      const outcome = cold('-(a|)', {a: idState});
      const spy = jest.spyOn(store, 'dispatch');
      // @ts-ignore
      const action = guard.getQueryAction();
      // @ts-ignore
      store.pipe = jest.fn(() => outcome.pipe(
        // @ts-ignore
        select(guard.getObjectLoadedSelector()),
        // @ts-ignore
        tap(loaded => !loaded && store.dispatch(guard.getQueryAction())),
        filter(loaded => loaded),
        take(1)
      ).pipe(
        switchMap(() => of(true)),
        catchError(() => of(false))
      ));
      const expected = cold('-(a|)', { a: true });
      await expect(guard.canActivate()).toBeObservable(expected);
      return expect(spy).not.toHaveBeenCalledWith(action);
    });
  });

  describe('checkStore', async () => {
    it('should return true if users are loaded', async () => {
      const idState = mockIdState();
      const outcome = cold('-(a|)', {a: idState});
      const spy = jest.spyOn(store, 'dispatch');
      // @ts-ignore
      const action = guard.getQueryAction();
      store.pipe = jest.fn(() => outcome.pipe(
        // @ts-ignore
        select(guard.getObjectLoadedSelector()),
        // @ts-ignore
        tap(_ => store.dispatch(guard.getQueryAction())),
        filter(loaded => loaded),
        take(1)
      ));
      const expected = cold('-(b|)', { b: true });
      await expect(guard.canActivate()).toBeObservable(expected);
      return expect(spy).toHaveBeenCalledWith(action);
    });

    it('should dispatch QueryUsers action if users are not yet loaded', async () => {
      const idState = mockIdStateWithOnlyAuthUser();
      const outcome = cold('-(a|)', {a: idState});
      const spy = jest.spyOn(store, 'dispatch');
      // @ts-ignore
      const action = guard.getQueryAction();
      store.pipe = jest.fn(() => outcome.pipe(
        // @ts-ignore
        select(guard.getObjectLoadedSelector()),
        // @ts-ignore
        tap(_ => store.dispatch(guard.getQueryAction())),
        filter(loaded => loaded),
        take(1)
      ));
      const expected = cold('-(a|)', { a: true });
      await expect(guard.canActivate()).toBeObservable(expected);
      return expect(spy).toHaveBeenCalledWith(action);
    });
  });
});
