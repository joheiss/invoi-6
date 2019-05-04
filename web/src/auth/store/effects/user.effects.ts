import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import * as userActions from '../actions/users.actions';
import {catchError, map, mergeMap, switchMap, tap} from 'rxjs/operators';
import {of} from 'rxjs/index';
import {Store} from '@ngrx/store';
import {AppState} from '../../../app/store/reducers';
import * as fromRoot from '../../../app/store';
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
  queryUsers$ = this.actions$.pipe(
    ofType(userActions.QUERY_USERS),
    switchMap(() => this.usersService.queryAll()),
    mergeMap(actions => actions),
    map(action => {
      return {type: `[Auth] User ${action.type}`, payload: {...action.payload.doc.data(), uid: action.payload.doc.id}};
    })
  );

  @Effect()
  queryOneUser$ = this.actions$.pipe(
    ofType(userActions.QUERY_ONE_USER),
    map((action: userActions.QueryOneUser) => action.payload),
    switchMap(payload => this.usersService.queryOne(payload)),
    mergeMap(actions => actions),
    map(action => {
      return {type: `[Auth] User ${action.type}`, payload: {...action.payload.doc.data(), uid: action.payload.doc.id}};
    })
  );

  @Effect()
  updateUser$ = this.actions$.pipe(
    ofType(userActions.UPDATE_USER),
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
  updateUserSuccess$ = this.actions$.pipe(
    ofType(userActions.UPDATE_USER_SUCCESS),
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
  updateUserFail$ = this.actions$.pipe(
    ofType(userActions.UPDATE_USER_FAIL),
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
  updateUserProfile$ = this.actions$.pipe(
    ofType(userActions.UPDATE_USERPROFILE),
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
  updateUserProfileSuccess$ = this.actions$.pipe(
    ofType(userActions.UPDATE_USERPROFILE_SUCCESS),
    map((action: userActions.UpdateUserSuccess) => action.payload),
    switchMap(user => [
      new fromRoot.StopSpinning(),
      new fromRoot.OpenSnackBar({
        message: this.usersService.getMessage('userprofile-update-success', [user.email])
      })
    ])
  );

  @Effect()
  updateUserProfileFail$ = this.actions$.pipe(
    ofType(userActions.UPDATE_USERPROFILE_FAIL),
    map((action: userActions.UpdateUserProfileFail) => action.payload),
    switchMap(error => [
      new fromRoot.StopSpinning(),
      new fromRoot.OpenSnackBar({
        message: this.usersService.getMessage('userprofile-update-fail', [error.message])
      })
    ])
  );

  @Effect()
  createUser$ = this.actions$.pipe(
    ofType(userActions.CREATE_USER),
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
  createUserSuccess$ = this.actions$.pipe(
    ofType(userActions.CREATE_USER_SUCCESS),
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
  createUserFail$ = this.actions$.pipe(
    ofType(userActions.CREATE_USER_FAIL),
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
