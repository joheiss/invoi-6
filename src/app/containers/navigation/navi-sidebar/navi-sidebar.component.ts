import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {UserData} from '../../../../auth/models/user';
import {Observable} from 'rxjs/observable';

@Component({
  selector: 'jo-navi-sidebar',
  templateUrl: './navi-sidebar.component.html',
  styleUrls: ['./navi-sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NaviSidebarComponent {
  @Input() auth$: Observable<UserData>;
  @Output() close = new EventEmitter<void>();

  constructor() {
  }

  onClose() {
    this.close.emit();
  }
}
