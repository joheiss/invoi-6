import {TestBed} from '@angular/core/testing';
import {select, Store} from '@ngrx/store';
import {AuthenticationGuard} from './authentication.guard';
import {AppState} from '../../app/store';
import {cold} from 'jasmine-marbles';
import {RouterTestingModule} from '@angular/router/testing';
import {catchError, map, switchMap, take} from 'rxjs/operators';
import {selectAuth} from '../store';
import {of} from 'rxjs/index';
import {mockIdState} from '../../test/factories/mock-id-state.factory';
import {mockAuth} from '../../test/factories/mock-auth.factory';

describe('Authentication Guard', () => {
  let store: Store<AppState>;
  let guard: AuthenticationGuard;

  beforeEach(async() => {
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
        AuthenticationGuard
      ]
    });
    store = TestBed.inject(Store);
    guard = TestBed.inject(AuthenticationGuard);

    // Mock implementation of console.error to return undefined to stop printing out to console log during test
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  it('should create the guard', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', async () => {
    it('should return true if user is authenticated', () => {
      const outcome = cold('-(a|)', { a: mockIdState() });
      // @ts-ignore
      store.pipe = jest.fn(() => outcome.pipe(
        select(selectAuth),
        map(auth => !!auth),
        take(1)
      ).pipe(
        switchMap(isAuthenticated => of(isAuthenticated)),
        catchError(() => of(false))
      ));
      const expected = cold('-(b|)', { b: true });
      return expect(guard.canActivate(null, null)).toBeObservable(expected);
    });

    it('should return false if user is not authenticated', () => {
      const idState = { ...mockIdState(), auth: null };
      const outcome = cold('-(a|)', { a: idState });
      // @ts-ignore
      store.pipe = jest.fn(() => outcome.pipe(
        select(selectAuth),
        map(auth => !!auth),
        take(1)
      ).pipe(
        switchMap(isAuthenticated => of(isAuthenticated)),
        catchError(() => of(false))
      ));
      const expected = cold('-(b|)', { b: false });
      return expect(guard.canActivate(null, null)).toBeObservable(expected);
    });
  });

  describe('canLoad', async () => {
    it('should return true if user is authenticated', () => {
      const outcome = cold('-(a|)', { a: mockIdState() });
      // @ts-ignore
      store.pipe = jest.fn(() => outcome.pipe(
        select(selectAuth),
        map(auth => !!auth),
        take(1)
      ).pipe(
        switchMap(isAuthenticated => of(isAuthenticated)),
        catchError(() => of(false))
      ));
      const expected = cold('-(b|)', { b: true });
      return expect(guard.canActivate(null, null)).toBeObservable(expected);
    });

    it('should return false if user is not authenticated', () => {
      const idState = { ...mockIdState(), auth: null };
      const outcome = cold('-(a|)', { a: idState });
      // @ts-ignore
      store.pipe = jest.fn(() => outcome.pipe(
        select(selectAuth),
        map(auth => !!auth),
        take(1)
      ).pipe(
        switchMap(isAuthenticated => of(isAuthenticated)),
        catchError(() => of(false))
      ));
      const expected = cold('-(b|)', { b: false });
      return expect(guard.canActivate(null, null)).toBeObservable(expected);
    });
  });

  describe('checkUser', async () => {
    it('should return true if user is authenticated', () => {
      const authUser = mockAuth()[0];
      const outcome = cold('-a|', { a: authUser });
      // @ts-ignore
      store.pipe = jest.fn(() => outcome.pipe(map(auth => !!auth), take(1)));
      const expected = cold('-(b|)', { b: true });
      // @ts-ignore
      return expect(guard['checkUser']()).toBeObservable(expected);
    });

    it('should return false if user is not authenticated', () => {
      const authUser = null;
      const outcome = cold('-a|', { a: authUser });
      // @ts-ignore
      store.pipe = jest.fn(() => outcome.pipe(map(auth => !!auth), take(1)));
      const expected = cold('-(b|)', { b: false });
      return expect(guard['checkUser']()).toBeObservable(expected);
    });
  });

});
