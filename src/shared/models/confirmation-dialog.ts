import {Action} from '@ngrx/store';

export interface ConfirmationDialogData {
  do: Action;
  cancel?: Action;
  go?: Action;
  text?: string;
  title: string;
  reply?: boolean;
}
