import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {Observable, of} from 'rxjs/index';
import {combineLatest} from 'rxjs/observable/combineLatest';
import {catchError, filter, map, switchMap, take, tap} from 'rxjs/operators';

import * as fromStore from '../store';

@Injectable()
export abstract class ObjectExistsGuard implements CanActivate {

  protected constructor(protected store: Store<fromStore.InvoicingState>) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    console.log('ROUTE: ', route);
    return this.checkStore(route)
      .pipe(
        switchMap(() => {
          if (route.params.id === 'copy' || route.params.id === 'new' || route.params.id === 'quick') {
            return of(true);
          }
          return this.hasObject(route.params.id);
        }),
        catchError((err, caught) => {
          console.error(err, caught);
          return of(false);
        })
      );
  }

  protected checkStore(route: ActivatedRouteSnapshot): Observable<boolean> {
    return combineLatest([
      this.store.pipe(select(fromStore.selectNumberRangesLoaded)),
      this.store.pipe(select(fromStore.selectContractsLoaded)),
      this.store.pipe(select(fromStore.selectReceiversLoaded)),
      this.store.pipe(select(fromStore.selectInvoicesLoaded)),
    ])
      .pipe(
        tap(results => {
          if (!results[0]) {
            this.store.dispatch(new fromStore.QueryNumberRanges());
          }
          if (!results[1]) {
            this.store.dispatch(new fromStore.QueryContracts());
          }
          if (!results[2]) {
            this.store.dispatch(new fromStore.QueryReceivers());
          }
          if (!results[3]) {
            this.store.dispatch(new fromStore.QueryInvoices());
          }
          this.store.dispatch(new fromStore.QueryDocumentLinksForObject({ objectType: route.url[0].path, id: route.params.id }));
        }),
        map(([numberRangesLoaded,
               contractsLoaded,
               receiversLoaded,
               invoicesLoaded]) =>
          numberRangesLoaded && contractsLoaded && receiversLoaded && invoicesLoaded),
        tap(loaded => console.log(`[Guard] all dependencies loaded: ${loaded}`)),
        filter(loaded => loaded),
        take(1)
      );
  }

  protected abstract hasObject(id: string): Observable<boolean>;

}
