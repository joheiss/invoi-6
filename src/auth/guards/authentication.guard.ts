import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanLoad, Route, RouterStateSnapshot} from '@angular/router';
import {AppState} from '../../app/store/reducers';
import {select, Store} from '@ngrx/store';
import {catchError, delay, first, map, switchMap, take, tap} from 'rxjs/operators';
import {Observable, of} from 'rxjs/index';
import * as fromStore from '../store';

@Injectable()
export class AuthenticationGuard implements CanActivate, CanLoad {

  constructor(private store: Store<AppState>) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.checkUser()
      .pipe(
        tap(isAuthenticated => console.log('Is authenticated: ', isAuthenticated)),
        switchMap(isAuthenticated =>  of(isAuthenticated)),
        catchError(() => of(false))
      );
  }

  canLoad(route: Route): Observable<boolean> {
    return this.checkUser()
      .pipe(
        tap(isAuthenticated => console.log('Is authenticated: ', isAuthenticated)),
        // actually the following switchMap is the correct one. It is commented to make a refresh work!
        switchMap(isAuthenticated => of(isAuthenticated)),
        // switchMap(isAuthenticated => of(true)), // this is actually incorrect.
        catchError(() => of(false))
      );
  }

  protected checkUser(): Observable<boolean> {
    return this.store.pipe(
      select(fromStore.selectAuthLoading),
      map(loading => {
        console.log('Auth loading: ', loading);
        if (loading) {
          setTimeout(() => {
            return this.store.pipe(select(fromStore.selectAuth));
          }, 50);
        } else {
          return this.store.pipe(select(fromStore.selectAuth));
        }
      }),
      map(auth => !!auth),
      take(1));
  }
}
