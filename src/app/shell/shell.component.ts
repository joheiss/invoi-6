import {Component, OnInit} from '@angular/core';
import * as fromStore from '../store';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs/observable';
import {UserData} from '../../auth/models/user';
import {selectAuth, selectCurrentUser} from '../../auth/store/selectors';
import * as authActions from '../../auth/store/actions';

@Component({
  selector: 'jo-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit {

  auth$: Observable<UserData>;
  user$: Observable<UserData>;
  isSpinning$: Observable<boolean>;

  constructor(private store: Store<fromStore.AppState>) {}

  ngOnInit(): void {
    this.isSpinning$ = this.store.pipe(select(fromStore.selectIsSpinning));
    this.auth$ = this.store.pipe(select(selectAuth));
    this.user$ = this.store.pipe(select(selectCurrentUser));
    this.store.dispatch(new authActions.QueryAuth());
  }
}

