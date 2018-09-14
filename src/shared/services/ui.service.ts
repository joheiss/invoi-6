import {Injectable} from '@angular/core';
import {MatDialog, MatSnackBar} from '@angular/material';
import {MessageContent} from '../models/message.model';
import {ConfirmationDialogData} from '../models/confirmation-dialog';
import {Observable} from 'rxjs/Observable';
import {ConfirmationDialogPopupComponent} from '../popups/confirmation-dialog-popup/confirmation-dialog-popup.component';
import {MatSnackBarRef} from '@angular/material/snack-bar/typings/snack-bar-ref';

@Injectable()
export class UiService {

  constructor(private snackBar: MatSnackBar,
              private dialog: MatDialog) {
  }

  openSnackBar(message: MessageContent, action: string = null, config: any = { duration: 3000 }) {
    switch (message.usage) {
      case 'error': {
        config.duration = 30000;
        config.extraClasses = ['jo-snackbar-error'];
        break;
      }
      case 'info': {
        config.duration = 3000;
        config.extraClasses = ['jo-snackbar-info'];
        break;
      }
      case 'success': {
        config.duration = 3000;
        config.extraClasses = ['jo-snackbar-success'];
        break;
      }
      case 'warning': {
        config.duration = 10000;
        config.extraClasses = ['jo-snackbar-warning'];
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
        title: payload.title
      }
    });
    return dialogRef.afterClosed().map(reply => {
      const response = Object.assign({}, payload);
      response.reply = reply;
      return response;
    });
  }

}