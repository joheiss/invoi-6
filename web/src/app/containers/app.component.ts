import {ChangeDetectionStrategy, Component} from '@angular/core';
import {PwaService} from '../services/pwa.service';

@Component({
  selector: 'jo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {

  constructor(public pwa: PwaService) {}

  onInstallPwa(): void {
      this.pwa.promptEvent.prompt();
  }
}
