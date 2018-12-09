import {ChangeDetectionStrategy, Component, HostListener} from '@angular/core';
import {PwaService} from '../pwa.service';
import * as authActions from '../../auth/store/actions';
import {Store} from '@ngrx/store';
import {AppState} from '../store/reducers';

@Component({
  selector: 'jo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {

  constructor(public pwa: PwaService,
              private store: Store<AppState>) {}

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event) {
    confirm('Do you really want to leave');
    this.store.dispatch(new authActions.Logout());
  }

  onInstallPwa(): void {
      this.pwa.promptEvent.prompt();
  }
}
