import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {Effect, Actions, ofType} from '@ngrx/effects';

import * as RouterActions from '../actions/router.actions';

import {tap, map} from 'rxjs/operators';

@Injectable()
export class RouterEffects {

  constructor(private actions$: Actions,
              private router: Router,
              private location: Location) {
  }

  @Effect({dispatch: false})
  navigate$ = this.actions$.pipe(
    ofType(RouterActions.GO),
    map((action: RouterActions.Go) => action.payload),
    tap(({path, query: queryParams, extras}) => {
      this.router.navigate(path, {queryParams, ...extras});
    }));

  @Effect({dispatch: false})
  navigateBack$ = this.actions$.pipe(
    ofType(RouterActions.BACK),
    tap(() => this.location.back())
  );

  @Effect({dispatch: false})
  navigateForward$ = this.actions$.pipe(
    ofType(RouterActions.FORWARD),
    tap(() => this.location.forward())
  );

  @Effect({dispatch: false})
  leaveLogin$ = this.actions$.pipe(
    ofType(RouterActions.LEAVE_LOGIN),
    map((action: RouterActions.LeaveLogin) => action.payload),
    tap(user => {
      // console.log('Logged in user: ', user);
      // console.log('current Url: ', this.router.url);
      if (user && this.router.url.endsWith('login')) {
          return this.router.navigate(user.roles && user.roles.indexOf('sales-user') >= 0 ? ['/invoicing'] : ['']);
      } else {
        return;
      }
    }));
}
