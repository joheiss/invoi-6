import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanLoad, Route, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';

import * as _ from 'lodash';
import * as fromStore from '../store';
import {filter, map, take, tap} from 'rxjs/operators';
import {Store} from '@ngrx/store';
import {AppState} from '../../app/store/reducers';

@Injectable()
export class AuthorizationGuard implements CanActivate, CanLoad {

  constructor(private store: Store<AppState>) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.checkAuthorization(route.data['roles']);
  }

  canLoad(route: Route): Observable<boolean>  {
    return this.checkAuthorization(route.data['roles']);
  }

  private checkAuthorization(allowedRoles: string[]): Observable<boolean> {
    return this.store.select(fromStore.selectAuth)
      .pipe(
        filter(auth => !!auth),
        tap(auth => console.log('AUTH ROLES: ', auth.roles, 'ALLOWED ROLES: ', allowedRoles)),
        map(auth => auth.roles && _.intersection(allowedRoles, auth.roles).length > 0),
        take(1)
      );
  }
}
