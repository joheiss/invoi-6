import {Action} from '@ngrx/store';

export * from './number-ranges.actions';
export * from './receivers.actions';
export * from './contracts.actions';
export * from './invoices.actions';
export * from './settings.actions';
export * from './document-links.actions';

export const CLEAR_STATE = '[Auth] clear state';
export class ClearState implements Action {
  readonly type = CLEAR_STATE;
  constructor() {}
}

