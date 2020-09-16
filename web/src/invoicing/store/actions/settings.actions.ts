import {Action} from '@ngrx/store';
import {SettingData} from 'jovisco-domain';

// FIRESTORE
export const QUERY_SETTINGS = '[Invoicing] Settings query';
export const ADDED_SETTING = '[Invoicing] Setting added';
export const MODIFIED_SETTING = '[Invoicing] Setting modified';
export const REMOVED_SETTING = '[Invoicing] Setting removed';
export const UPDATE_SETTING = '[Invoicing] Setting update';
export const UPDATE_SETTING_FAIL = '[Invoicing] Setting update fail';
export const UPDATE_SETTING_SUCCESS = '[Invoicing] Setting update success';

export class QuerySettings implements Action {
  readonly type = QUERY_SETTINGS;
  constructor() {}
}

export class AddedSetting implements Action {
  readonly type = ADDED_SETTING;
  constructor(public payload: SettingData) {}
}

export class ModifiedSetting implements Action {
  readonly type = MODIFIED_SETTING;
  constructor(public payload: SettingData) {}
}

export class RemovedSetting implements Action {
  readonly type = REMOVED_SETTING;
  constructor(public payload: SettingData) {}
}

export class UpdateSetting implements Action {
  readonly type = UPDATE_SETTING;
  constructor(public payload: SettingData) {}
}

export class UpdateSettingSuccess implements Action {
  readonly type = UPDATE_SETTING_SUCCESS;
  constructor(public payload: SettingData) {}
}

export class UpdateSettingFail implements Action {
  readonly type = UPDATE_SETTING_FAIL;
  constructor(public payload: any) {
  }
}

// CREATING
export const CREATE_SETTING = '[Invoicing] Create Setting';
export const CREATE_SETTING_FAIL = '[Invoicing] Create Setting Fail';
export const CREATE_SETTING_SUCCESS = '[Invoicing] Create Setting Success';

export class CreateSetting implements Action {
  readonly type = CREATE_SETTING;
  constructor(public payload: SettingData) {
  }
}

export class CreateSettingFail implements Action {
  readonly type = CREATE_SETTING_FAIL;
  constructor(public payload: any) {
  }
}

export class CreateSettingSuccess implements Action {
  readonly type = CREATE_SETTING_SUCCESS;
  constructor(public payload: SettingData) {
  }
}

// DELETING
export const DELETE_SETTING = '[Invoicing] Delete Setting';
export const DELETE_SETTING_FAIL = '[Invoicing] Delete Setting Fail';
export const DELETE_SETTING_SUCCESS = '[Invoicing] Delete Setting Success';

export class DeleteSetting implements Action {
  readonly type = DELETE_SETTING;
  constructor(public payload: SettingData) {
  }
}

export class DeleteSettingFail implements Action {
  readonly type = DELETE_SETTING_FAIL;
  constructor(public payload: any) {
  }
}

export class DeleteSettingSuccess implements Action {
  readonly type = DELETE_SETTING_SUCCESS;
  constructor(public payload: SettingData) {
  }
}
// COPYING
export const COPY_SETTING = '[Invoicing] Copy Setting';
export const COPY_SETTING_FAIL = '[Invoicing] Copy Setting Fail';
export const COPY_SETTING_SUCCESS = '[Invoicing] Copy Setting Success';

export class CopySetting implements Action {
  readonly type = COPY_SETTING;
  constructor(public payload: SettingData) {
  }
}

export class CopySettingFail implements Action {
  readonly type = COPY_SETTING_FAIL;
  constructor(public payload: any) {
  }
}

export class CopySettingSuccess implements Action {
  readonly type = COPY_SETTING_SUCCESS;
  constructor(public payload: SettingData) {
  }
}

// NEW
export const NEW_SETTING = '[Invoicing] New Setting';
export const NEW_SETTING_FAIL = '[Invoicing] New Setting Fail';
export const NEW_SETTING_SUCCESS = '[Invoicing] New Setting Success';

export class NewSetting implements Action {
  readonly type = NEW_SETTING;
  constructor() {
  }
}

export class NewSettingFail implements Action {
  readonly type = NEW_SETTING_FAIL;
  constructor(public payload: any) {
  }
}

export class NewSettingSuccess implements Action {
  readonly type = NEW_SETTING_SUCCESS;
  constructor(public payload: SettingData) {
  }
}

// SELECTING
export const SELECT_SETTING = '[Invoicing] Select Setting';
export const SELECT_SETTING_FAIL = '[Invoicing] Select Setting Fail';
export const SELECT_SETTING_SUCCESS = '[Invoicing] Select Setting Success';

export class SelectSetting implements Action {
  readonly type = SELECT_SETTING;
  constructor(public payload: SettingData) {
  }
}

export class SelectSettingFail implements Action {
  readonly type = SELECT_SETTING_FAIL;
  constructor(public payload: any) {
  }
}

export class SelectSettingSuccess implements Action {
  readonly type = SELECT_SETTING_SUCCESS;
  constructor(public payload: SettingData) {
  }
}

// SELECTING
export const CHANGE_SETTING = '[Invoicing] Change Setting';
export const CHANGE_SETTING_FAIL = '[Invoicing] Change Setting Fail';
export const CHANGE_SETTING_SUCCESS = '[Invoicing] Change Setting Success';

export class ChangeSetting implements Action {
  readonly type = CHANGE_SETTING;
  constructor(public payload: SettingData) {
  }
}

export class ChangeSettingFail implements Action {
  readonly type = CHANGE_SETTING_FAIL;
  constructor(public payload: any) {
  }
}

export class ChangeSettingSuccess implements Action {
  readonly type = CHANGE_SETTING_SUCCESS;
  constructor(public payload: SettingData) {
  }
}

export type SettingAction =
  CreateSetting | CreateSettingFail | CreateSettingSuccess |
  DeleteSetting | DeleteSettingFail | DeleteSettingSuccess |
  CopySetting | CopySettingFail | CopySettingSuccess |
  NewSetting | NewSettingFail | NewSettingSuccess |
  SelectSetting | SelectSettingFail | SelectSettingSuccess |
  ChangeSetting | ChangeSettingFail | ChangeSettingSuccess |
  QuerySettings | AddedSetting | ModifiedSetting | RemovedSetting |
  UpdateSetting | UpdateSettingFail | UpdateSettingSuccess;


