import {TestBed} from '@angular/core/testing';
import {select, Store} from '@ngrx/store';
import {generateIdState, generateUserProfile} from '../../test/test-generators';
import {AppState} from '../../app/store/reducers';
import {cold} from 'jasmine-marbles';
import {RouterTestingModule} from '@angular/router/testing';
import {AuthorizationGuard} from './authorization.guard';
import {ActivatedRouteSnapshot} from '@angular/router';
import {catchError, filter, map, switchMap, take} from 'rxjs/operators';
import * as _ from 'lodash';
import {selectAuth} from '../store/selectors';
import {of} from 'rxjs/internal/observable/of';

describe('Authorization Guard', () => {
  let store: Store<AppState>;
  let guard: AuthorizationGuard;

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
        AuthorizationGuard
      ]
    });
    store = TestBed.get(Store);
    guard = TestBed.get(AuthorizationGuard);

    // Mock implementation of console.error to return undefined to stop printing out to console log during test
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  it('should create the guard', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', async () => {
    it('should return true if user is authorized', () => {
      const idState = generateIdState();
      const allowedRoles = ['sales-user'];
      const outcome = cold('-(a|)', {a: idState});
      store.pipe = jest.fn(() => outcome.pipe(
        select(selectAuth),
        filter(auth => !!auth),
        map(auth => !!(auth.roles && _.intersection(allowedRoles, auth.roles).length > 0)),
        take(1)
      ).pipe(
        switchMap(isAuthorized => of(isAuthorized)),
        catchError(() => of(false))
      ));
      const route = ({data: {roles: allowedRoles}} as any) as ActivatedRouteSnapshot;
      const expected = cold('-(b|)', {b: true});
      return expect(guard.canActivate(route, null)).toBeObservable(expected);
    });

    it('should return false if user is not authenticated', () => {
      const idState = {...generateIdState(), auth: null};
      const allowedRoles = ['sales-user'];
      const outcome = cold('-(a|)', {a: idState});
      store.pipe = jest.fn(() => outcome.pipe(
        select(selectAuth),
        filter(auth => !!auth),
        map(auth => !!(auth.roles && _.intersection(allowedRoles, auth.roles).length > 0)),
        take(1)
      ).pipe(
        switchMap(isAuthorized => of(isAuthorized)),
        catchError(() => of(false))
      ));
      const route = ({data: {roles: allowedRoles}} as any) as ActivatedRouteSnapshot;
      const expected = cold('-(b|)', {b: false});
      return expect(guard.canActivate(route, null)).toBeObservable(expected);
    });

    it('should return false if user is not authorized', () => {
      const idState = generateIdState();
      const allowedRoles = ['king-of-swing'];
      const outcome = cold('-(a|)', {a: idState});
      store.pipe = jest.fn(() => outcome.pipe(
        select(selectAuth),
        filter(auth => !!auth),
        map(auth => !!(auth.roles && _.intersection(allowedRoles, auth.roles).length > 0)),
        take(1)
      ).pipe(
        switchMap(isAuthorized => of(isAuthorized)),
        catchError(() => of(false))
      ));
      const route = ({data: {roles: allowedRoles}} as any) as ActivatedRouteSnapshot;
      const expected = cold('-(b|)', {b: false});
      return expect(guard.canActivate(route, null)).toBeObservable(expected);
    });
  });

  describe('canLoad', async () => {
    it('should return true if user is authorized', () => {
      const idState = generateIdState();
      const allowedRoles = ['sales-user'];
      const outcome = cold('-(a|)', {a: idState});
      store.pipe = jest.fn(() => outcome.pipe(
        select(selectAuth),
        filter(auth => !!auth),
        map(auth => !!(auth.roles && _.intersection(allowedRoles, auth.roles).length > 0)),
        take(1)
      ).pipe(
        switchMap(isAuthorized => of(isAuthorized)),
        catchError(() => of(false))
      ));
      const route = ({data: {roles: allowedRoles}} as any) as ActivatedRouteSnapshot;
      const expected = cold('-(b|)', {b: true});
      return expect(guard.canActivate(route, null)).toBeObservable(expected);
    });

    it('should return false if user is not authenticated', () => {
      const idState = {...generateIdState(), auth: null};
      const allowedRoles = ['sales-user'];
      const outcome = cold('-(a|)', {a: idState});
      store.pipe = jest.fn(() => outcome.pipe(
        select(selectAuth),
        filter(auth => !!auth),
        map(auth => !!(auth.roles && _.intersection(allowedRoles, auth.roles).length > 0)),
        take(1)
      ).pipe(
        switchMap(isAuthorized => of(isAuthorized)),
        catchError(() => of(false))
      ));
      const route = ({data: {roles: allowedRoles}} as any) as ActivatedRouteSnapshot;
      const expected = cold('-(b|)', {b: false});
      return expect(guard.canActivate(route, null)).toBeObservable(expected);
    });

    it('should return false if user is not authorized', () => {
      const idState = generateIdState();
      const allowedRoles = ['king-of-swing'];
      const outcome = cold('-(a|)', {a: idState});
      store.pipe = jest.fn(() => outcome.pipe(
        select(selectAuth),
        filter(auth => !!auth),
        map(auth => !!(auth.roles && _.intersection(allowedRoles, auth.roles).length > 0)),
        take(1)
      ).pipe(
        switchMap(isAuthorized => of(isAuthorized)),
        catchError(() => of(false))
      ));
      const route = ({data: {roles: allowedRoles}} as any) as ActivatedRouteSnapshot;
      const expected = cold('-(b|)', {b: false});
      return expect(guard.canActivate(route, null)).toBeObservable(expected);
    });
  });

  describe('checkAuthorization', async () => {
    it('should return true if user is authorized', () => {
      const allowedRoles = ['sales-user'];
      const authUser = generateUserProfile();
      const outcome = cold('-a|', {a: authUser});
      store.pipe = jest.fn(() => outcome.pipe(
        filter(auth => !!auth),
        map(auth => !!(auth.roles && _.intersection(allowedRoles, auth.roles).length > 0)),
        take(1))
      );
      const expected = cold('-(b|)', {b: true});
      // @ts-ignore
      return expect(guard.checkAuthorization(allowedRoles)).toBeObservable(expected);
    });

    it('should throw an error if user is not authorized', () => {
      const allowedRoles = ['sales-user'];
      const authUser = null;
      const outcome = cold('-a|', {a: authUser});
      store.pipe = jest.fn(() => outcome.pipe(
        filter(auth => !!auth),
        map(auth => !!(auth.roles && _.intersection(allowedRoles, auth.roles).length > 0)),
        take(1))
      );
      const expected = cold('--|', undefined);
      // @ts-ignore
      return expect(guard.checkAuthorization(allowedRoles)).toBeObservable(expected);
    });

    it('should return false if user is not authenticated', () => {
      const allowedRoles = ['king-of-swing'];
      const authUser = generateUserProfile();
      const outcome = cold('-a|', {a: authUser});
      store.pipe = jest.fn(() => outcome.pipe(
        filter(auth => !!auth),
        map(auth => !!(auth.roles && _.intersection(allowedRoles, auth.roles).length > 0)),
        take(1))
      );
      const expected = cold('-(b|)', {b: false});
      // @ts-ignore
      return expect(guard.checkAuthorization(allowedRoles)).toBeObservable(expected);
    });
  });
});
