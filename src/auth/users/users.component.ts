import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material';
import {User} from '../models/user';
import {UsersBusinessService} from '../business-services/users-business.service';
import {UsersUiService} from '../services';
import {UserDetailsDialogComponent} from './user-details-dialog/user-details-dialog.component';

@Component({
  selector: 'jo-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: User[];
  displayedColumns = ['imageUrl', 'email', 'phoneNumber', 'displayName', 'organization', 'roles', 'isLocked'];
  dataSource = new MatTableDataSource<User>();

  constructor(private service: UsersBusinessService,
              private uiService: UsersUiService) {}

  ngOnInit() {
    this.service.getAllUsers()
      .subscribe(users => {
        this.dataSource.data = users;
      });
  }

  onNew() {
    const userToCreate = User.createFromData(this.service.new());
    const popupData = { title: 'Benutzer anlegen', task: 'new', user: userToCreate };
    this.uiService.openUserProfilePopup(popupData, UserDetailsDialogComponent);
  }

  onSelect(user: User) {
    const userToEdit = User.createFromData(user.data);
    const popupData = { title: 'Benutzer pflegen', task: 'edit', user: userToEdit };
    this.uiService.openUserProfilePopup(popupData, UserDetailsDialogComponent);
  }

  onToggleLock(user: User) {
    console.log('Lock / unlock user to be implemented!!!!');
  }

}
