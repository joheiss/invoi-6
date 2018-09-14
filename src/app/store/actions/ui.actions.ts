import {Action} from '@ngrx/store';
import {MatSnackBarConfig} from '@angular/material';
import {MessageContent} from '../../../shared/models/message.model';
import {ConfirmationDialogData} from '../../../shared/models/confirmation-dialog';

export const OPEN_SNACKBAR = '[Ui] open snackbar';
export const START_SPINNING = '[Ui] start spinning';
export const STOP_SPINNING = '[Ui] stop spinning';
export const OPEN_URL = '[Ui] open url';
export const OPEN_CONFIRMATION_DIALOG = '[Ui] open confirmation dialog';

export class OpenSnackBar implements Action {
  readonly type = OPEN_SNACKBAR;
  constructor(public payload: { message: MessageContent, action?: string, options?: MatSnackBarConfig }) {}
}

export class StartSpinning implements Action {
  readonly type = START_SPINNING;
  constructor() {}
}

export class StopSpinning implements Action {
  readonly type = STOP_SPINNING;
  constructor() {}
}

export class OpenUrl implements Action {
  readonly type = OPEN_URL;
  constructor(public payload: string) {}
}

export class OpenConfirmationDialog implements Action {
  readonly type = OPEN_CONFIRMATION_DIALOG;
  constructor(public payload: ConfirmationDialogData) {}
}

export type UiAction =
  OpenSnackBar | StartSpinning | StopSpinning | OpenUrl;
