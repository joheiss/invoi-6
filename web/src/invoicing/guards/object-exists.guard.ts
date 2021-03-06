import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {combineLatest, Observable, of} from 'rxjs/index';
import {catchError, filter, map, switchMap, take, tap} from 'rxjs/operators';

import * as fromStore from '../store';
import {Go} from '../../app/store/actions';

@Injectable()
export abstract class ObjectExistsGuard implements CanActivate {

  protected constructor(protected store: Store<fromStore.InvoicingState>) {
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.checkStore(route)
      .pipe(
        switchMap(() => {
          if (route.params.id === 'copy' || route.params.id === 'new' || route.params.id === 'quick') {
            return this.hasCurrentObject();
          }
          return this.hasObject(route.params.id);
        }),
        catchError((err, caught) => {
          this.store.dispatch(new Go({path: ['/invoicing']}));
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
          this.store.dispatch(new fromStore.QueryDocumentLinksForObject({objectType: route.url[0].path, id: route.params.id}));
        }),
        map(([numberRangesLoaded,
               contractsLoaded,
               receiversLoaded,
               invoicesLoaded
             ]) =>
          numberRangesLoaded && contractsLoaded && receiversLoaded && invoicesLoaded),
        tap(loaded => console.log(`[Guard] all dependencies loaded: ${loaded}`)),
        filter(loaded => loaded),
        take(1)
      );
  }

  protected abstract hasCurrentObject(): Observable<boolean>;
  protected abstract hasObject(id: string): Observable<boolean>;

}
