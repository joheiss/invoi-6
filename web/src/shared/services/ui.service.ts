import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

import {ConfirmationDialogData} from '../models/confirmation-dialog';
import {Observable} from 'rxjs/index';
import {ConfirmationDialogPopupComponent} from '../popups/confirmation-dialog-popup/confirmation-dialog-popup.component';
import {map} from 'rxjs/internal/operators';
import {SharedModule} from '../shared.module';
import {MessageContent} from 'jovisco-domain';

@Injectable({
  providedIn: SharedModule
})
export class UiService {

  constructor(private snackBar: MatSnackBar,
              private dialog: MatDialog) {
  }

  openSnackBar(message: MessageContent, action: string = null, config: any = { duration: 3000 }) {
    switch (message.usage) {
      case 'error': {
        config.duration = 30000;
        config.panelClass = ['jo-snackbar-error'];
        break;
      }
      case 'info': {
        config.duration = 3000;
        config.panelClass = ['jo-snackbar-info'];
        break;
      }
      case 'success': {
        config.duration = 3000;
        config.panelClass = ['jo-snackbar-success'];
        break;
      }
      case 'warning': {
        config.duration = 10000;
        config.panelClass = ['jo-snackbar-warning'];
        break;
      }
      default:
        // do nothing special
    }
    this.snackBar.open(message.text, action, config);
  }

  openUrl(downloadUrl: string) {
    window.open(downloadUrl, '_blank');
  }

  openConfirmationDialog(payload: ConfirmationDialogData): Observable<ConfirmationDialogData> {
    const dialogRef = this.dialog.open(ConfirmationDialogPopupComponent, {
      data: {
        title: payload.title,
        text: payload.text
      }
    });
    return dialogRef.afterClosed().pipe(
      map(reply => {
        const response = Object.assign({}, payload);
        response.reply = reply;
        return response;
      }));
  }

}
