import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Observable} from 'rxjs/observable';
import {UsersUiService} from '../../../../auth/services';
import {UserDetailsDialogComponent} from '../../../../auth/users/user-details-dialog/user-details-dialog.component';
import {environment} from '../../../../environments/environment';
import {UserData} from 'jovisco-domain';
import {UserFactory} from 'jovisco-domain/dist/user/user-factory';

@Component({
  selector: 'jo-navi-header',
  templateUrl: './navi-header.component.html',
  styleUrls: ['./navi-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NaviHeaderComponent {
  @Input() auth$: Observable<UserData>;
  @Input() user: UserData;
  @Output() toggle = new EventEmitter<void>();

  constructor(private usersUiService: UsersUiService) {
  }

  isDevelopment(): boolean {
    return !environment.production;
  }

  onMyProfile() {
    const userToEdit = UserFactory.fromData(this.user);
    const popupData = {title: 'Meine Daten', task: 'my-profile', user: userToEdit};
    this.usersUiService.openUserProfilePopup(popupData, UserDetailsDialogComponent);
  }

  onToggle() {
    this.toggle.emit();
  }
}
