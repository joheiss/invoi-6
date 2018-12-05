import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanLoad, Route, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs/index';
import * as _ from 'lodash';
import * as fromStore from '../store';
import {catchError, filter, map, switchMap, take, tap} from 'rxjs/operators';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../app/store/reducers';

@Injectable()
export class AuthorizationGuard implements CanActivate, CanLoad {

  constructor(private store: Store<AppState>) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.checkAuthorization(route.data['roles'])
      .pipe(
        tap(isAuthorized => console.log('Is authorized: ', isAuthorized)),
        switchMap(isAuthorized => of(isAuthorized)),
        catchError(() => of(false))
      );
  }

  canLoad(route: Route): Observable<boolean>  {
    return this.checkAuthorization(route.data['roles'])
      .pipe(
        tap(isAuthorized => console.log('Is authorized: ', isAuthorized)),
        switchMap(isAuthorized => of(isAuthorized)),
        catchError(() => of(false))
      );
  }

  private checkAuthorization(allowedRoles: string[]): Observable<boolean> {
    return this.store.pipe(
      select(fromStore.selectAuth),
        filter(auth => !!auth),
        map(auth => !!(auth.roles && _.intersection(allowedRoles, auth.roles).length > 0)),
        take(1)
      );
  }
}
