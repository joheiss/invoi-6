import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import * as authActions from '../actions/auth.actions';
import * as usersActions from '../actions/users.actions';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {of} from 'rxjs/index';
import {AuthService} from '../../services/auth.service';
import {ClearState} from '../../../invoicing/store/actions';
import {Store} from '@ngrx/store';
import * as fromRoot from '../../../app/store';
import {AppState} from '../../../app/store/reducers';

@Injectable()
export class AuthEffects {

  constructor(private actions$: Actions,
              private authService: AuthService,
              private store: Store<AppState>) {
  }

  @Effect()
  queryAuth$ = this.actions$.pipe(
    ofType(authActions.QUERY_AUTH),
    tap(() => '*** AUTH Query Auth'),
    map((action: authActions.QueryAuth) => action.payload),
    switchMap(() => this.authService.queryAuth()
      .pipe(
        tap(user => console.log('AUTH QUERY RESULT: ', user)),
        map(user => new authActions.Authenticated(user)),
        catchError(error => of(new authActions.NotAuthenticated(error)))
      ))
  );

  @Effect()
  login$ = this.actions$.pipe(
    ofType(authActions.LOGIN),
    tap(() => console.log('*** ABOUT TO LOGIN')),
    tap(() => this.store.dispatch(new fromRoot.StartSpinning())),
    map((action: authActions.Login) => action.payload),
    switchMap(credentials => this.authService.login(credentials)
      .pipe(
        map(credentials => new authActions.QueryAuth()),
        catchError(error => of(new authActions.NotAuthenticated(error)))
      ))
  );

  @Effect()
  logout$ = this.actions$.pipe(
    ofType(authActions.LOGOUT),
    tap(() => console.log('*** ABOUT TO LOGOUT')),
    map((action: authActions.Logout) => action),
    switchMap(() => this.authService.logout()
      .pipe(
        tap(() => console.log('*** CLEAR STATE ***')),
        map(() => new ClearState()),
      ))
  );

  @Effect()
  authenticated$ = this.actions$.pipe(
    ofType(authActions.AUTHENTICATED),
    map((action: authActions.Authenticated) => action.payload),
    tap(user => console.log('*** AUTHENTICATED ***, ', user)),
    switchMap(user => [
      new usersActions.QueryOneUser(user.uid),
      new fromRoot.Go({path: user.roles && user.roles.indexOf('sales-user') >= 0 ? ['/invoicing'] : ['']}),
      new fromRoot.StopSpinning()
    ])
  );

  @Effect()
  notAuthenticated$ = this.actions$.pipe(
    ofType(authActions.NOT_AUTHENTICATED),
    tap(() => console.log('*** NOT AUTHENTICATED ***')),
    switchMap(() => [
      new fromRoot.Go({path: ['/login']}),
      new fromRoot.StopSpinning()
    ])
  );

  @Effect()
  changeMyPassword$ = this.actions$.pipe(
    ofType(authActions.CHANGE_MY_PASSWORD),
    tap(() => console.log('*** ABOUT TO CHANGE MY PASSWORD')),
    tap(() => this.store.dispatch(new fromRoot.StartSpinning())),
    map((action: authActions.ChangeMyPassword) => action.payload),
    switchMap(credentials => this.authService.changeMyPassword(credentials)
      .pipe(
        map(() => new authActions.ChangeMyPasswordSuccess()),
        catchError(error => of(new authActions.ChangeMyPasswordFail(error)))
      ))
  );

  @Effect()
  changeMyPasswordSuccess$ = this.actions$.pipe(
    ofType(authActions.CHANGE_MY_PASSWORD_SUCCESS),
    tap(() => console.log('*** PW CHANGED')),
    map((action: authActions.ChangeMyPasswordSuccess) => action.payload),
    switchMap(() => [
      new fromRoot.StopSpinning(),
      new fromRoot.OpenSnackBar({
        message: this.authService.getMessage('password-update-success')
      })
    ])
  );

  @Effect()
  changeMyPasswordFail$ = this.actions$.pipe(
    ofType(authActions.CHANGE_MY_PASSWORD_FAIL),
    tap(() => console.log('*** PW CHANGE ERROR')),
    map((action: authActions.ChangeMyPasswordFail) => action.payload),
    switchMap((err) => [
      new fromRoot.StopSpinning(),
      new fromRoot.OpenSnackBar({
        message: this.authService.getMessage('password-update-fail', [err.message])
      })
    ])
  );

  @Effect()
  changePassword$ = this.actions$.pipe(
    ofType(authActions.CHANGE_PASSWORD),
    tap(() => console.log('*** ABOUT TO CHANGE PASSWORD')),
    tap(() => this.store.dispatch(new fromRoot.StartSpinning())),
    map((action: authActions.ChangePassword) => action.payload),
    switchMap(credentials => this.authService.changePassword(credentials)
      .pipe(
        map(() => new authActions.ChangePasswordSuccess()),
        catchError(error => of(new authActions.ChangePasswordFail(error)))
      ))
  );

  @Effect()
  changePasswordSuccess$ = this.actions$.pipe(
    ofType(authActions.CHANGE_PASSWORD_SUCCESS),
    tap(() => console.log('*** PW CHANGED')),
    map((action: authActions.ChangePasswordSuccess) => action.payload),
    switchMap(() => [
      new fromRoot.StopSpinning(),
      new fromRoot.OpenSnackBar({
        message: this.authService.getMessage('password-update-success')
      })
    ])
  );

  @Effect()
  changePasswordFail$ = this.actions$.pipe(
    ofType(authActions.CHANGE_PASSWORD_FAIL),
    tap(() => console.log('*** PW CHANGE ERROR')),
    map((action: authActions.ChangePasswordFail) => action.payload),
    switchMap((err) => [
      new fromRoot.StopSpinning(),
      new fromRoot.OpenSnackBar({
        message: this.authService.getMessage('password-update-fail', [err.message])
      })
    ])
  );
}
