import {Injectable} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {UserProfilePopupData} from '../models/user-profile-popup-data';

@Injectable({
  providedIn: 'root'
})
export class UsersUiService {

  constructor(private dialog: MatDialog) {}

  openPasswordChangePopup(data: UserProfilePopupData, popup: any): MatDialogRef<any>  {
    const dimensions = this.calculatePasswordDialogDimensions();
    return this.dialog.open(popup, {
      ...dimensions,
      data: {title: data.title, task: data.task, user: data.user }
    });
  }

  openUserProfilePopup(data: UserProfilePopupData, popup: any): MatDialogRef<any>  {
    const dimensions = this.calculateUserDialogDimensions(data.task);
    const payload = this.buildDialogData(data);
    return this.dialog.open(popup, {...dimensions, data: payload });
  }

  private buildDialogData(data: any): any {
    if (data.task === 'new') {
      const credentials = {password: undefined, confirm: undefined};
      return {title: data.title, task: data.task, user: data.user, passwords: credentials};
    } else {
      return {title: data.title, task: data.task, user: data.user};
    }
  }

  private calculatePasswordDialogDimensions(): any {
    return {
      height: '90%',
      width: '66%',
      minHeight: '47rem',
      minWidth: '39rem',
      maxHeight: '60rem',
      maxWidth: '45rem'
    };
  }

  private calculateUserDialogDimensions(task: string): any {
    let maxHeight: string;
    if (task === 'new') {
      maxHeight = '80rem';
    } else if (task === 'edit') {
      maxHeight = '70rem';
    } else {
      maxHeight = '60rem';
    }
    return {
      height: '90%',
      width: '66%',
      minHeight: '67rem',
      minWidth: '39rem',
      maxHeight: maxHeight,
      maxWidth: '60rem',
    };
  }
}
