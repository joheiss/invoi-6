import {Component, EventEmitter, Input, Output} from '@angular/core';
import {User, UserData} from '../../../../auth/models/user';
import {Observable} from 'rxjs/Observable';
import {UsersUiService} from '../../../../auth/services';
import {UserDetailsDialogComponent} from '../../../../auth/users/user-details-dialog/user-details-dialog.component';
import {filter, take, tap} from 'rxjs/operators';

@Component({
  selector: 'jo-navi-header',
  templateUrl: './navi-header.component.html',
  styleUrls: ['./navi-header.component.scss']
})
export class NaviHeaderComponent {
  @Input('auth$') auth$: Observable<UserData>;
  @Input('user') user: UserData;
  @Output('toggle') toggle = new EventEmitter<void>();

  constructor(private usersUiService: UsersUiService) {
  }

  onMyProfile() {
    /*
    this.auth$.pipe(
      filter(auth => !!auth),
      tap(auth => console.log('Auth: ', auth)),
      take(1)
    ).subscribe(auth => {
    */
    console.log('*** USER DATA: *** ', this.user);
      const userToEdit = User.createFromData(this.user);
      const popupData = { title: 'Meine Daten', task: 'my-profile', user: userToEdit };
      this.usersUiService.openUserProfilePopup(popupData, UserDetailsDialogComponent);
    // });

  }
  onToggle() {
    this.toggle.emit();
  }
}
