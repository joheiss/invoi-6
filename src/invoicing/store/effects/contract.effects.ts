import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import * as fromServices from '../../services';
import * as contractActions from '../actions/contracts.actions';
import {catchError, concatMap, filter, map, mergeMap, switchMap, tap} from 'rxjs/operators';
import {of} from 'rxjs/index';
import * as fromRoot from '../../../app/store';
import {select, Store} from '@ngrx/store';
import {selectAuth} from '../../../auth/store/selectors';
import {UserData} from '../../../auth/models/user';

@Injectable()
export class ContractsEffects {

  auth: UserData;

  constructor(private actions$: Actions,
              private contractsService: fromServices.ContractsService,
              private store: Store<fromRoot.AppState>) {
  }

  // FIRESTORE

  @Effect()
  queryContracts$ = this.actions$.pipe(
    ofType(contractActions.QUERY_CONTRACTS),
    map((action: contractActions.QueryContracts) => action.payload),
    switchMap(() => this.store.pipe(select(selectAuth))
      .pipe(
        filter(auth => !!auth),
        tap(auth => this.auth = auth),
        switchMap(payload => this.contractsService.queryAll()),
        mergeMap(actions => actions),
        filter(action => action.payload.doc.data().organization === this.auth.organization),
        map(action => {
          const type = `[Invoicing] Contract ${action.type}`;
          const payload = {...action.payload.doc.data(), id: action.payload.doc.id};
          payload.issuedAt = payload.issuedAt.toDate();
          payload.startDate = payload.startDate.toDate();
          payload.endDate = payload.endDate.toDate();
          return {type, payload};
        })
      ))
  );

  @Effect()
  updateContract$ = this.actions$.pipe(
    ofType(contractActions.UPDATE_CONTRACT),
    tap(() => this.store.dispatch(new fromRoot.StartSpinning())),
    map((action: contractActions.UpdateContract) => action.payload),
    switchMap(contract => this.contractsService.update(contract)
      .pipe(
        map(contract => new contractActions.UpdateContractSuccess(contract)),
        catchError(error => of(new contractActions.UpdateContractFail(error))
        )
      ))
  );

  @Effect()
  updateContractSuccess$ = this.actions$.pipe(
    ofType(contractActions.UPDATE_CONTRACT_SUCCESS),
    map((action: contractActions.UpdateContractSuccess) => action.payload),
    mergeMap(contract => [
      new fromRoot.StopSpinning(),
      new fromRoot.OpenSnackBar({
        message: this.contractsService.getMessage('contract-update-success', [contract.id])
      }),
      new fromRoot.Go({path: ['/invoicing/contracts']})
    ])
  );

  @Effect()
  updateContractFail$ = this.actions$.pipe(
    ofType(contractActions.UPDATE_CONTRACT_FAIL),
    map((action: contractActions.UpdateContractFail) => action.payload),
    mergeMap(error => [
      new fromRoot.StopSpinning(),
      new fromRoot.OpenSnackBar({
        message: this.contractsService.getMessage('contract-update-fail', [error.message])
      })
    ])
  );

  // --- CREATING
  @Effect()
  createContract$ = this.actions$.pipe(
    ofType(contractActions.CREATE_CONTRACT),
    tap(() => this.store.dispatch(new fromRoot.StartSpinning())),
    map((action: contractActions.CreateContract) => action.payload),
    switchMap(contract => this.contractsService.create(contract)
      .pipe(
        map(contract => new contractActions.CreateContractSuccess(contract)),
        catchError(error => of(new contractActions.CreateContractFail(error)))
      ))
  );

  @Effect()
  createContractSuccess$ = this.actions$.pipe(
    ofType(contractActions.CREATE_CONTRACT_SUCCESS),
    map((action: contractActions.CreateContractSuccess) => action.payload),
    mergeMap(contract => [
      new fromRoot.StopSpinning(),
      new fromRoot.Go({path: ['/invoicing/contracts', contract.id]})
    ])
  );

  @Effect()
  createContractFail$ = this.actions$.pipe(
    ofType(contractActions.CREATE_CONTRACT_FAIL),
    map((action: contractActions.CreateContractFail) => action.payload),
    mergeMap(error => [
      new fromRoot.StopSpinning(),
      new fromRoot.OpenSnackBar({
        message: this.contractsService.getMessage('contract-create-fail', [error.message])
      })
    ])
  );

  // DELETING
  @Effect()
  deleteContract$ = this.actions$.pipe(
    ofType(contractActions.DELETE_CONTRACT),
    map((action: contractActions.DeleteContract) => action.payload),
    switchMap(contract => this.contractsService.delete(contract)
      .pipe(
        map(() => new contractActions.DeleteContractSuccess(contract)),
        catchError(error => of(new contractActions.DeleteContractFail(error)))
      ))
  );

  @Effect()
  deleteContractSuccess$ = this.actions$.pipe(
    ofType(contractActions.DELETE_CONTRACT_SUCCESS),
    map((action: contractActions.DeleteContractSuccess) => action.payload),
    mergeMap(contract => [
      new fromRoot.StopSpinning(),
      new fromRoot.OpenSnackBar({
        message: this.contractsService.getMessage('contract-delete-success', [contract.id])
      }),
      new fromRoot.Go({path: ['/invoicing/contracts']})
    ])
  );

  @Effect()
  deleteContractFail$ = this.actions$.pipe(
    ofType(contractActions.DELETE_CONTRACT_FAIL),
    map((action: contractActions.DeleteContractFail) => action.payload),
    mergeMap(error => [
      new fromRoot.StopSpinning(),
      new fromRoot.OpenSnackBar({
        message: this.contractsService.getMessage('contract-delete-fail', [error.message])
      })
    ])
  );

  // --- COPYING
  @Effect()
  copyContractSuccess$ = this.actions$.pipe(
    ofType(contractActions.COPY_CONTRACT_SUCCESS),
    map((action: contractActions.CopyContractSuccess) => action.payload),
    map(contract => new fromRoot.Go({path: ['/invoicing/contracts', 'copy']}))
  );

  // --- NEW
  @Effect()
  newContractSuccess$ = this.actions$.pipe(
    ofType(contractActions.NEW_CONTRACT_SUCCESS),
    map((action: contractActions.NewContractSuccess) => action.payload),
    map(contract => new fromRoot.Go({path: ['/invoicing/contracts', 'new']}))
  );
}
