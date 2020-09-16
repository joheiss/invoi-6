import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import * as fromStore from '../store';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs/observable';
import {selectAuth, selectCurrentUser} from '../../auth/store/selectors';
import {UserData} from 'jovisco-domain';

@Component({
  selector: 'jo-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShellComponent implements OnInit {

  auth$: Observable<UserData>;
  user$: Observable<UserData>;
  isSpinning$: Observable<boolean>;

  constructor(private store: Store<fromStore.AppState>) {}

  ngOnInit(): void {
    // this.store.dispatch(new authActions.QueryAuth());
    this.isSpinning$ = this.store.pipe(select(fromStore.selectIsSpinning));
    this.auth$ = this.store.pipe(select(selectAuth));
    this.user$ = this.store.pipe(select(selectCurrentUser));
  }

}

