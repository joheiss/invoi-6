import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot} from '@angular/router';
import {AppState} from '../../app/store/reducers';
import {select, Store} from '@ngrx/store';
import {catchError, mergeMap, map, switchMap, take, tap, debounceTime, retryWhen, delayWhen, delay} from 'rxjs/operators';
import {Observable, of, throwError} from 'rxjs/index';
import * as fromStore from '../store';

@Injectable()
export class AuthenticationGuard implements CanActivate, CanLoad {

  constructor(private store: Store<AppState>, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.checkUser()
      .pipe(
        tap(isAuthenticated => console.log('Is authenticated: ', isAuthenticated)),
        switchMap(isAuthenticated => of(isAuthenticated)),
        catchError(() => of(false))
      );
  }

  canLoad(route: Route): Observable<boolean> {
    return this.checkUser()
      .pipe(
        tap(isAuthenticated => console.log('Is authenticated: ', isAuthenticated)),
        switchMap(isAuthenticated => of(isAuthenticated)),
        catchError(() => of(false))
      );
  }

  protected checkUser(): Observable<boolean> {
    let counter = 0;
    return this.store.pipe(
      select(fromStore.selectAuth),
      map(auth => !!auth),
      map(auth => {
        if (!auth && counter < 5) {
          counter++;
          throw(new Error('no_auth'));
        } else {
          if (!auth) this.router.navigate(['/auth/login']);
          return auth;
        }
      }),
      retryWhen(err => err.pipe(
        delay(500)
      )),
      take(1));
  }
}
