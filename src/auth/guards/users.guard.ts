import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';
import {Action, Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {catchError, filter, switchMap, take, tap} from 'rxjs/operators';
import {of} from 'rxjs/observable/of';

import * as fromStore from '../store';

@Injectable()
export abstract class UsersGuard implements CanActivate {

  constructor(protected store: Store<fromStore.IdState>) {}

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

  protected getObjectLoadedSelector(): any {
    return fromStore.selectMoreThanOneUserLoaded;
  }

  protected getQueryAction(): Action {
    return new fromStore.QueryUsers();
  }
}


