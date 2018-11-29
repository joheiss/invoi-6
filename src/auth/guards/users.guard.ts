import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';
import {Action, select, Store} from '@ngrx/store';
import {Observable, of} from 'rxjs/index';
import {catchError, filter, switchMap, take, tap} from 'rxjs/operators';

import * as fromStore from '../store';

@Injectable({
  providedIn: 'root'
})
export class UsersGuard implements CanActivate {

  constructor(private store: Store<fromStore.IdState>) {
  }

  canActivate(): Observable<boolean> {
    return this.checkStore()
      .pipe(
        switchMap(() => of(true)),
        catchError(() => of(false))
      );
  }

  private checkStore(): Observable<boolean> {
    return this.store.pipe(
      select(this.getObjectLoadedSelector()),
      tap(loaded => !loaded && this.store.dispatch(this.getQueryAction())),
      filter(loaded => loaded),
      take(1)
    );
  }

  private getObjectLoadedSelector(): any {
    return fromStore.selectMoreThanOneUserLoaded;
  }

  private getQueryAction(): Action {
    return new fromStore.QueryUsers();
  }
}


