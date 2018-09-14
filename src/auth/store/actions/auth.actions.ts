import {Action} from '@ngrx/store';
import {UserCredentials, UserData} from '../../models/user';

export const QUERY_AUTH = '[Auth] query';
export const AUTHENTICATED = '[Auth] authenticated';
export const NOT_AUTHENTICATED = '[Auth] not authenticated';
export const LOGIN = '[Auth] login';
export const LOGOUT = '[Auth] logout';
export const CHANGE_MY_PASSWORD = '[Auth] change my password';
export const CHANGE_MY_PASSWORD_SUCCESS = '[Auth] change my password success';
export const CHANGE_MY_PASSWORD_FAIL = '[Auth] change my password fail';
export const CHANGE_PASSWORD = '[Auth] change password';
export const CHANGE_PASSWORD_SUCCESS = '[Auth] change password success';
export const CHANGE_PASSWORD_FAIL = '[Auth] change password fail';

export class QueryAuth implements Action {
  readonly type = QUERY_AUTH;
  constructor(public payload?: UserData) {}
}

export class Authenticated implements Action {
  readonly type = AUTHENTICATED;
  constructor(public payload?: UserData) {}
}

export class NotAuthenticated implements Action {
  readonly type = NOT_AUTHENTICATED;
  constructor(public payload?: any) {}
}

export class Login implements Action {
  readonly type = LOGIN;
  constructor(public payload?: UserCredentials) {}
}

export class Logout implements Action {
  readonly type = LOGOUT;
  constructor() {}
}

export class ChangeMyPassword implements Action {
  readonly type = CHANGE_MY_PASSWORD;
  constructor(public payload: { uid: string, email?: string, oldPassword?: string, password: string}) {}
}

export class ChangeMyPasswordSuccess implements Action {
  readonly type = CHANGE_MY_PASSWORD_SUCCESS;
  constructor(public payload?: any) {}
}

export class ChangeMyPasswordFail implements Action {
  readonly type = CHANGE_MY_PASSWORD_FAIL;
  constructor(public payload: any) {}
}

export class ChangePassword implements Action {
  readonly type = CHANGE_PASSWORD;
  constructor(public payload: { uid: string, password: string}) {}
}

export class ChangePasswordSuccess implements Action {
  readonly type = CHANGE_PASSWORD_SUCCESS;
  constructor(public payload?: any) {}
}

export class ChangePasswordFail implements Action {
  readonly type = CHANGE_PASSWORD_FAIL;
  constructor(public payload: any) {}
}

export type AuthAction =
  QueryAuth |  Authenticated | NotAuthenticated |
  Login | Logout |
  ChangeMyPassword | ChangeMyPasswordFail | ChangeMyPasswordSuccess |
  ChangePassword | ChangePasswordFail | ChangePasswordSuccess;
