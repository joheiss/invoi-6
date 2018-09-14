import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';
import {Action, Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {catchError, filter, switchMap, take, tap} from 'rxjs/operators';
import {of} from 'rxjs/observable/of';

import * as fromStore from '../store';

@Injectable()
export abstract class ObjectsGuard implements CanActivate {

  constructor(protected store: Store<fromStore.InvoicingState>) {}

  canActivate(): Observable<boolean> {
    return this.checkStore()
      .pipe(
        switchMap(() => of(true)),
        catchError(() => of(false))
      );
  }

  protected checkStore(): Observable<boolean> {
    return this.store.select(this.getObjectLoadedSelector())
      .pipe(
        tap(loaded => !loaded && this.store.dispatch(this.getQueryAction())),
        filter(loaded => loaded),
        take(1)
      );
  }

  protected abstract getObjectLoadedSelector(): any;
  protected abstract getQueryAction(): Action;
}


