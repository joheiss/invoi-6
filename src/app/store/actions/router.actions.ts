import {Action} from '@ngrx/store';
import {NavigationExtras} from '@angular/router';
import {UserData} from '../../../auth/models/user';

export const GO = '[Router] Go';
export const BACK = '[Router] Back';
export const FORWARD = '[Router] Forward';
export const LEAVE_LOGIN = '[Router] Leave Login';

export class Go implements Action {
  readonly type = GO;
  constructor(public payload: { path: any[], query?: object, extras?: NavigationExtras}) {}
}

export class Back implements Action {
  readonly type = BACK;
}

export class Forward implements Action {
  readonly type = FORWARD;
}

export class LeaveLogin implements Action {
  readonly type = LEAVE_LOGIN;
  constructor(public payload: UserData) {}
}

export type Actions = Go | Back | Forward | LeaveLogin;

