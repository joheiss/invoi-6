import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import * as userActions from '../actions/users.actions';
import {catchError, map, mergeMap, switchMap, tap} from 'rxjs/operators';
import {of} from 'rxjs/index';
import {Store} from '@ngrx/store';
import {AppState} from '../../../app/store/reducers/index';
import * as fromRoot from '../../../app/store/index';
import {UsersService, UsersUiService} from '../../services';

@Injectable()
export class UserEffects {

  constructor(private actions$: Actions,
              private usersService: UsersService,
              private usersUiService: UsersUiService,
              private store: Store<AppState>) {
  }

  // FIRESTORE
  @Effect()
  queryUsers$ = this.actions$
    .ofType(userActions.QUERY_USERS)
    .pipe(
      switchMap(action => this.usersService.queryAll()),
      mergeMap(actions => actions),
      map(action => {
        const type = `[Auth] User ${action.type}`;
        const payload = action.payload.doc.data();
        return { type: `[Auth] User ${action.type}`, payload: { ...action.payload.doc.data(), uid: action.payload.doc.id } };
      })
    );

  @Effect()
  queryOneUser$ = this.actions$
    .ofType(userActions.QUERY_ONE_USER)
    .pipe(
      map((action: userActions.QueryOneUser) => action.payload),
      switchMap(payload => this.usersService.queryOne(payload)),
      mergeMap(actions => actions),
      map(action => {
        const type = `[Auth] User ${action.type}`;
        const payload = action.payload.doc.data();
        return { type: `[Auth] User ${action.type}`, payload: { ...action.payload.doc.data(), uid: action.payload.doc.id } };
      })
    );

  @Effect()
  updateUser$ = this.actions$
    .ofType(userActions.UPDATE_USER)
    .pipe(
      tap(() => this.store.dispatch(new fromRoot.StartSpinning())),
      map((action: userActions.UpdateUser) => action.payload),
      switchMap(userAndPassword => this.usersService.update(userAndPassword)
        .pipe(
          map(user => new userActions.UpdateUserSuccess(user)),
          catchError(error => {
            console.error(error);
            return of(new userActions.UpdateUserFail(error));
          })
        ))
    );

  @Effect()
  updateUserSuccess$ = this.actions$
    .ofType(userActions.UPDATE_USER_SUCCESS)
    .pipe(
      map((action: userActions.UpdateUserSuccess) => action.payload),
      switchMap(user => [
        new fromRoot.StopSpinning(),
        new fromRoot.OpenSnackBar({
          message: this.usersService.getMessage('user-update-success', [user.email])
        }),
        new fromRoot.Go({path: ['/users']})
      ])
    );

  @Effect()
  updateUserFail$ = this.actions$
    .ofType(userActions.UPDATE_USER_FAIL)
    .pipe(
      map((action: userActions.UpdateUserFail) => action.payload),
      switchMap(error => [
        new fromRoot.StopSpinning(),
        new fromRoot.OpenSnackBar({
          message: this.usersService.getMessage('user-update-fail', [error.message])
        }),
        new fromRoot.Go({path: ['/users']})
      ])
    );

  @Effect()
  updateUserProfile$ = this.actions$
    .ofType(userActions.UPDATE_USERPROFILE)
    .pipe(
      tap(() => this.store.dispatch(new fromRoot.StartSpinning())),
      map((action: userActions.UpdateUserProfile) => action.payload),
      switchMap(userProfile => this.usersService.updateProfile(userProfile)
        .pipe(
          map(userProfile => new userActions.UpdateUserProfileSuccess(userProfile)),
          catchError(error => {
            console.error(error);
            return of(new userActions.UpdateUserProfileFail(error));
          })
        ))
    );

  @Effect()
  updateUserProfileSuccess$ = this.actions$
    .ofType(userActions.UPDATE_USERPROFILE_SUCCESS)
    .pipe(
      map((action: userActions.UpdateUserSuccess) => action.payload),
      switchMap(user => [
        new fromRoot.StopSpinning(),
        new fromRoot.OpenSnackBar({
          message: this.usersService.getMessage('userprofile-update-success', [user.email])
        })
      ])
    );

  @Effect()
  updateUserProfileFail$ = this.actions$
    .ofType(userActions.UPDATE_USERPROFILE_FAIL)
    .pipe(
      map((action: userActions.UpdateUserProfileFail) => action.payload),
      switchMap(error => [
        new fromRoot.StopSpinning(),
        new fromRoot.OpenSnackBar({
          message: this.usersService.getMessage('userprofile-update-fail', [error.message])
        })
      ])
    );

  @Effect()
  createUser$ = this.actions$
    .ofType(userActions.CREATE_USER)
    .pipe(
      tap(() => this.store.dispatch(new fromRoot.StartSpinning())),
      map((action: userActions.CreateUser) => action.payload),
      switchMap(userAndPassword => this.usersService.create(userAndPassword)
        .pipe(
          map(user => new userActions.CreateUserSuccess(user)),
          catchError(error => {
            console.error(error);
            return of(new userActions.CreateUserFail(error));
          })
        ))
    );

  @Effect()
  createUserSuccess$ = this.actions$
    .ofType(userActions.CREATE_USER_SUCCESS)
    .pipe(
      map((action: userActions.CreateUserSuccess) => action.payload),
      switchMap(user => [
        new fromRoot.StopSpinning(),
        new fromRoot.OpenSnackBar({
          message: this.usersService.getMessage('user-create-success', [user.email])
        }),
        new fromRoot.Go({path: ['/users']})
      ])
    );

  @Effect()
  createUserFail$ = this.actions$
    .ofType(userActions.CREATE_USER_FAIL)
    .pipe(
      map((action: userActions.CreateUserFail) => action.payload),
      switchMap(error => [
        new fromRoot.StopSpinning(),
        new fromRoot.OpenSnackBar({
          message: this.usersService.getMessage('user-create-fail', [error.message])
        }),
        new fromRoot.Go({path: ['/users']})
      ])
    );
}
