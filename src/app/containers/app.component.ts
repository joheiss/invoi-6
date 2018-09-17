import {Component, OnInit} from '@angular/core';
import * as fromStore from '../store';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {UserData} from '../../auth/models/user';
import {selectAuth, selectCurrentUser} from '../../auth/store/selectors';
import * as authActions from '../../auth/store/actions';

@Component({
  selector: 'jo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

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
