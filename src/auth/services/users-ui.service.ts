import {Injectable} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';
import {UserProfilePopupData} from '../models/user-profile-popup-data';

@Injectable({
  providedIn: 'root'
})
export class UsersUiService {

  constructor(private dialog: MatDialog) {}

  openPasswordChangePopup(data: UserProfilePopupData, popup: any): MatDialogRef<any>  {
    let dialogRef: MatDialogRef<any>;
    const dimensions = {
      height: '90%',
      width: '66%',
      minHeight: '47rem',
      minWidth: '39rem',
      maxHeight: '60rem',
      maxWidth: '45rem'
    };
    dialogRef = this.dialog.open(popup, {
      ...dimensions,
      maxHeight: '60rem',
      data: {title: data.title, task: data.task, user: data.user }
    });
    return dialogRef;
  }

  openUserProfilePopup(data: UserProfilePopupData, popup: any): MatDialogRef<any>  {
    let dialogRef: MatDialogRef<any>;
    const dimensions = {
      height: '90%',
      width: '66%',
      minHeight: '67rem',
      minWidth: '39rem',
      maxHeight: '80rem',
      maxWidth: '60rem'
    };
    if (data.task === 'new') {
      const credentials = { password: undefined, confirm: undefined };
      dialogRef = this.dialog.open(popup, {
        ...dimensions,
        maxHeight: '80rem',
        data: {title: data.title, task: data.task, user: data.user, passwords: credentials }
      });
    } else if (data.task === 'edit') {
      dialogRef = this.dialog.open(popup, {
        ...dimensions,
        maxHeight: '70rem',
        data: {title: data.title, task: data.task, user: data.user }
      });
    } else {
      dialogRef = this.dialog.open(popup, {
        ...dimensions,
        maxHeight: '60rem',
        data: {title: data.title, task: data.task, user: data.user }
      });
    }
    return dialogRef;
  }
}
