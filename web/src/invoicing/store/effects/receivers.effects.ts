import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {catchError, filter, map, mergeMap, switchMap, tap} from 'rxjs/operators';
import {of} from 'rxjs/index';
import * as fromRoot from '../../../app/store';
import * as receiverActions from '../actions/receivers.actions';
import * as fromServices from '../../services';
import {select, Store} from '@ngrx/store';
import {selectAuth} from '../../../auth/store/selectors';
import {UserData} from 'jovisco-domain';


@Injectable()
export class ReceiversEffects {

  auth: UserData;

  constructor(private actions$: Actions,
              private receiversService: fromServices.ReceiversService,
              private store: Store<fromRoot.AppState>) {
  }

  // FIRESTORE
  @Effect()
  queryReceivers$ = this.actions$.pipe(
    ofType(receiverActions.QUERY_RECEIVERS),
    map((action: receiverActions.QueryReceivers) => action.payload),
    switchMap(() => this.store.pipe(select(selectAuth))
      .pipe(
        filter(auth => !!auth),
        tap(auth => this.auth = auth),
        switchMap(payload => this.receiversService.queryAll()),
        mergeMap(actions => actions),
        filter(action => action.payload.doc.data().organization === this.auth.organization),
        map(action => {
          const type = `[Invoicing] Receiver ${action.type}`;
          const payload = {...action.payload.doc.data(), id: action.payload.doc.id};
          return {type, payload};
        })
      ))
  );

  @Effect()
  updateReceiver$ = this.actions$.pipe(
    ofType(receiverActions.UPDATE_RECEIVER),
    tap(() => this.store.dispatch(new fromRoot.StartSpinning())),
    map((action: receiverActions.UpdateReceiver) => action.payload),
    switchMap(receiver => this.receiversService.update(receiver)
      .pipe(
        map(receiver => new receiverActions.UpdateReceiverSuccess(receiver)),
        catchError(error => {
          console.error(error);
          return of(new receiverActions.UpdateReceiverFail(error));
        })
      ))
  );

  @Effect()
  updateReceiverSuccess$ = this.actions$.pipe(
    ofType(receiverActions.UPDATE_RECEIVER_SUCCESS),
    map((action: receiverActions.UpdateReceiverSuccess) => action.payload),
    mergeMap(receiver => [
      new fromRoot.StopSpinning(),
      new fromRoot.OpenSnackBar({
        message: this.receiversService.getMessage('receiver-update-success', [receiver.id])
      }),
      new fromRoot.Go({path: ['/invoicing/receivers']})
    ])
  );

  @Effect()
  updateReceiverFail$ = this.actions$.pipe(
    ofType(receiverActions.UPDATE_RECEIVER_FAIL),
    map((action: receiverActions.UpdateReceiverFail) => action.payload),
    mergeMap(error => [
      new fromRoot.StopSpinning(),
      new fromRoot.OpenSnackBar({
        message: this.receiversService.getMessage('receiver-update-fail', [error.message])
      })
    ])
  );

// --- CREATING
  @Effect()
  createReceiver$ = this.actions$.pipe(
    ofType(receiverActions.CREATE_RECEIVER),
    tap(() => this.store.dispatch(new fromRoot.StartSpinning())),
    map((action: receiverActions.CreateReceiver) => action.payload),
    switchMap(receiver => this.receiversService.create(receiver)
      .pipe(
        map(receiver => new receiverActions.CreateReceiverSuccess(receiver)),
        catchError(error => of(new receiverActions.CreateReceiverFail(error)))
      ))
  );

  @Effect()
  createReceiverSuccess$ = this.actions$.pipe(
    ofType(receiverActions.CREATE_RECEIVER_SUCCESS),
    map((action: receiverActions.CreateReceiverSuccess) => action.payload),
    mergeMap(receiver => [
      new fromRoot.StopSpinning(),
      new fromRoot.Go({path: ['/invoicing/receivers', receiver.id]})
    ])
  );

  @Effect()
  createReceiverFail$ = this.actions$.pipe(
    ofType(receiverActions.CREATE_RECEIVER_FAIL),
    map((action: receiverActions.CreateReceiverFail) => action.payload),
    mergeMap(error => [
      new fromRoot.StopSpinning(),
      new fromRoot.OpenSnackBar({
        message: this.receiversService.getMessage('receiver-create-fail', [error.message])
      })
    ])
  );

// DELETING
  @Effect()
  deleteReceiver$ = this.actions$.pipe(
    ofType(receiverActions.DELETE_RECEIVER),
    tap(() => this.store.dispatch(new fromRoot.StartSpinning())),
    map((action: receiverActions.DeleteReceiver) => action.payload),
    switchMap(receiver => this.receiversService.delete(receiver)
      .pipe(
        map(() => new receiverActions.DeleteReceiverSuccess(receiver)),
        catchError(error => of(new receiverActions.DeleteReceiverFail(error)))
      ))
  );

  @Effect()
  deleteReceiverSuccess$ = this.actions$.pipe(
    ofType(receiverActions.DELETE_RECEIVER_SUCCESS),
    map((action: receiverActions.DeleteReceiverSuccess) => action.payload),
    mergeMap(receiver => [
      new fromRoot.StopSpinning(),
      new fromRoot.OpenSnackBar({
        message: this.receiversService.getMessage('receiver-delete-success', [receiver.id])
      }),
      new fromRoot.Go({path: ['/invoicing/receivers']})
    ])
  );

  @Effect()
  deleteReceiverFail$ = this.actions$.pipe(
    ofType(receiverActions.DELETE_RECEIVER_FAIL),
    map((action: receiverActions.DeleteReceiverFail) => action.payload),
    mergeMap(error => [
      new fromRoot.StopSpinning(),
      new fromRoot.OpenSnackBar({
        message: this.receiversService.getMessage('receiver-delete-fail', [error.message])
      })
    ])
  );

// --- COPYING
  @Effect()
  copyReceiverSuccess$ = this.actions$.pipe(
    ofType(receiverActions.COPY_RECEIVER_SUCCESS),
    map((action: receiverActions.CopyReceiverSuccess) => action.payload),
    map(receiver => new fromRoot.Go({path: ['/invoicing/receivers', 'copy']}))
  );

// --- NEW
  @Effect()
  newReceiverSuccess$ = this.actions$.pipe(
    ofType(receiverActions.NEW_RECEIVER_SUCCESS),
    map((action: receiverActions.NewReceiverSuccess) => action.payload),
    map(receiver => new fromRoot.Go({path: ['/invoicing/receivers', 'new']}))
  );
}
