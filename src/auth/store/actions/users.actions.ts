import {Action} from '@ngrx/store';
import {UserData, UserProfileData} from '../../models/user';

export const QUERY_USERS = '[Auth] Users query';
export const QUERY_ONE_USER = '[Auth] User query';
export const ADDED_USER = '[Auth] User added';
export const MODIFIED_USER = '[Auth] User modified';
export const REMOVED_USER = '[Auth] User removed';
export const UPDATE_USER = '[Auth] User update';
export const UPDATE_USER_FAIL = '[Auth] User update fail';
export const UPDATE_USER_SUCCESS = '[Auth] User update success';
export const CREATE_USER = '[Auth] User create';
export const CREATE_USER_FAIL = '[Auth] User create fail';
export const CREATE_USER_SUCCESS = '[Auth] User create success';

export class QueryUsers implements Action {
  readonly type = QUERY_USERS;

  constructor(public payload?: UserData) {
  }
}

export class QueryOneUser implements Action {
  readonly type = QUERY_ONE_USER;

  constructor(public payload: string) {
  }
}

export class AddedUser implements Action {
  readonly type = ADDED_USER;

  constructor(public payload: UserData) {
  }
}

export class ModifiedUser implements Action {
  readonly type = MODIFIED_USER;

  constructor(public payload: UserData) {
  }
}

export class RemovedUser implements Action {
  readonly type = REMOVED_USER;

  constructor(public payload: UserData) {
  }
}

export class UpdateUser implements Action {
  readonly type = UPDATE_USER;

  constructor(public  payload: { user: UserData, password: string }) {
  }
}

export class UpdateUserSuccess implements Action {
  readonly type = UPDATE_USER_SUCCESS;

  constructor(public payload: UserData) {
  }
}

export class UpdateUserFail implements Action {
  readonly type = UPDATE_USER_FAIL;

  constructor(public payload: any) {
  }
}

export const UPDATE_USERPROFILE = '[Auth] User profile update';
export const UPDATE_USERPROFILE_FAIL = '[Auth] User profile update fail';
export const UPDATE_USERPROFILE_SUCCESS = '[Auth] User profile update success';


export class UpdateUserProfile implements Action {
  readonly type = UPDATE_USERPROFILE;

  constructor(public  payload: UserProfileData) {
  }
}

export class UpdateUserProfileSuccess implements Action {
  readonly type = UPDATE_USERPROFILE_SUCCESS;

  constructor(public payload: UserProfileData) {
  }
}

export class UpdateUserProfileFail implements Action {
  readonly type = UPDATE_USERPROFILE_FAIL;

  constructor(public payload: any) {
  }
}

export class CreateUser implements Action {
  readonly type = CREATE_USER;

  constructor(public payload: { user: UserData, password: string}) {
  }
}

export class CreateUserSuccess implements Action {
  readonly type = CREATE_USER_SUCCESS;

  constructor(public payload: UserData) {
  }
}

export class CreateUserFail implements Action {
  readonly type = CREATE_USER_FAIL;

  constructor(public payload: any) {
  }
}

export type UsersAction =
  QueryUsers | AddedUser | ModifiedUser | RemovedUser |
  UpdateUser | UpdateUserFail | UpdateUserSuccess;
