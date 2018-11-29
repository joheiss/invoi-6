import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import * as fromRoot from '../../app/store';
import * as fromStore from '../store';

@Component({
  selector: 'jo-goodbye',
  templateUrl: './goodbye.component.html',
  styleUrls: ['./goodbye.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GoodbyeComponent implements OnInit {

  constructor(private store: Store<fromRoot.AppState>) { }

  ngOnInit() {
    this.store.dispatch(new fromStore.Logout());
  }

}
