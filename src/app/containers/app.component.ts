import {Component, OnInit} from '@angular/core';
import * as fromStore from '../store';
import {Store} from '@ngrx/store';
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

  constructor(private store: Store<fromStore.AppState>) {}

  ngOnInit(): void {
    this.auth$ = this.store.select(selectAuth);
    this.user$ = this.store.select(selectCurrentUser);
    this.store.dispatch(new authActions.QueryAuth());
  }
}
