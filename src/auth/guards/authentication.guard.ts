import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanLoad, Route, RouterStateSnapshot} from '@angular/router';
import {AppState} from '../../app/store/reducers';
import {Store} from '@ngrx/store';
import {catchError, map, switchMap, take, tap} from 'rxjs/operators';
import {Observable, of} from 'rxjs/index';
import * as fromStore from '../store';

@Injectable()
export class AuthenticationGuard implements CanActivate, CanLoad {

  constructor(private store: Store<AppState>) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):  Observable<boolean> {
    return this.checkUser()
      .pipe(
        switchMap(() => of(true)),
        catchError(() => of(false))
      );
  }

  canLoad(route: Route): Observable<boolean> {
    return this.checkUser()
      .pipe(
        switchMap(() => of(true)),
        catchError(() => of(false))
      );
  }

  protected checkUser(): Observable<boolean> {
    return this.store.select(fromStore.selectAuth)
      .pipe(
        map(auth => !!auth),
        tap(auth => console.log('AUTHENTICATED! --> ', auth)),
        take(1)
      );
  }
}
