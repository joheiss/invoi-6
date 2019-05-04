import {Action} from '@ngrx/store';
import {ReceiverData} from 'jovisco-domain';

// FIRESTORE
export const QUERY_RECEIVERS = '[Invoicing] Receivers query';
export const ADDED_RECEIVER = '[Invoicing] Receiver added';
export const MODIFIED_RECEIVER = '[Invoicing] Receiver modified';
export const REMOVED_RECEIVER = '[Invoicing] Receiver removed';
export const UPDATE_RECEIVER = '[Invoicing] Receiver update';
export const UPDATE_RECEIVER_FAIL = '[Invoicing] Receiver update fail';
export const UPDATE_RECEIVER_SUCCESS = '[Invoicing] Receiver update success';

export class QueryReceivers implements Action {
  readonly type = QUERY_RECEIVERS;
  constructor(public payload?: any) {}
}

export class AddedReceiver implements Action {
  readonly type = ADDED_RECEIVER;
  constructor(public payload: ReceiverData) {}
}

export class ModifiedReceiver implements Action {
  readonly type = MODIFIED_RECEIVER;
  constructor(public payload: ReceiverData) {}
}

export class RemovedReceiver implements Action {
  readonly type = REMOVED_RECEIVER;
  constructor(public payload: ReceiverData) {}
}

export class UpdateReceiver implements Action {
  readonly type = UPDATE_RECEIVER;
  constructor(public payload: ReceiverData) {}
}

export class UpdateReceiverSuccess implements Action {
  readonly type = UPDATE_RECEIVER_SUCCESS;
  constructor(public payload: ReceiverData) {}
}

export class UpdateReceiverFail implements Action {
  readonly type = UPDATE_RECEIVER_FAIL;
  constructor(public payload: any) {
  }
}

// CREATING
export const CREATE_RECEIVER = '[Invoicing] Create Receiver';
export const CREATE_RECEIVER_FAIL = '[Invoicing] Create Receiver Fail';
export const CREATE_RECEIVER_SUCCESS = '[Invoicing] Create Receiver Success';

export class CreateReceiver implements Action {
  readonly type = CREATE_RECEIVER;
  constructor(public payload: ReceiverData) {
  }
}

export class CreateReceiverFail implements Action {
  readonly type = CREATE_RECEIVER_FAIL;
  constructor(public payload: any) {
  }
}

export class CreateReceiverSuccess implements Action {
  readonly type = CREATE_RECEIVER_SUCCESS;
  constructor(public payload: ReceiverData) {
  }
}

// DELETING
export const DELETE_RECEIVER = '[Invoicing] Delete Receiver';
export const DELETE_RECEIVER_FAIL = '[Invoicing] Delete Receiver Fail';
export const DELETE_RECEIVER_SUCCESS = '[Invoicing] Delete Receiver Success';

export class DeleteReceiver implements Action {
  readonly type = DELETE_RECEIVER;
  constructor(public payload: ReceiverData) {
  }
}

export class DeleteReceiverFail implements Action {
  readonly type = DELETE_RECEIVER_FAIL;
  constructor(public payload: any) {
  }
}

export class DeleteReceiverSuccess implements Action {
  readonly type = DELETE_RECEIVER_SUCCESS;
  constructor(public payload: ReceiverData) {
  }
}
// COPYING
export const COPY_RECEIVER = '[Invoicing] Copy Receiver';
export const COPY_RECEIVER_FAIL = '[Invoicing] Copy Receiver Fail';
export const COPY_RECEIVER_SUCCESS = '[Invoicing] Copy Receiver Success';

export class CopyReceiver implements Action {
  readonly type = COPY_RECEIVER;
  constructor(public payload: ReceiverData) {
  }
}

export class CopyReceiverFail implements Action {
  readonly type = COPY_RECEIVER_FAIL;
  constructor(public payload: any) {
  }
}

export class CopyReceiverSuccess implements Action {
  readonly type = COPY_RECEIVER_SUCCESS;
  constructor(public payload: ReceiverData) {
  }
}

// NEW
export const NEW_RECEIVER = '[Invoicing] New Receiver';
export const NEW_RECEIVER_FAIL = '[Invoicing] New Receiver Fail';
export const NEW_RECEIVER_SUCCESS = '[Invoicing] New Receiver Success';

export class NewReceiver implements Action {
  readonly type = NEW_RECEIVER;
  constructor() {
  }
}

export class NewReceiverFail implements Action {
  readonly type = NEW_RECEIVER_FAIL;
  constructor(public payload: any) {
  }
}

export class NewReceiverSuccess implements Action {
  readonly type = NEW_RECEIVER_SUCCESS;
  constructor(public payload: ReceiverData) {
  }
}

// SELECTING
export const SELECT_RECEIVER = '[Invoicing] Select Receiver';
export const SELECT_RECEIVER_FAIL = '[Invoicing] Select Receiver Fail';
export const SELECT_RECEIVER_SUCCESS = '[Invoicing] Select Receiver Success';

export class SelectReceiver implements Action {
  readonly type = SELECT_RECEIVER;
  constructor(public payload: ReceiverData) {
  }
}

export class SelectReceiverFail implements Action {
  readonly type = SELECT_RECEIVER_FAIL;
  constructor(public payload: any) {
  }
}

export class SelectReceiverSuccess implements Action {
  readonly type = SELECT_RECEIVER_SUCCESS;
  constructor(public payload: ReceiverData) {
  }
}

// SELECTING
export const CHANGE_RECEIVER = '[Invoicing] Change Receiver';
export const CHANGE_RECEIVER_FAIL = '[Invoicing] Change Receiver Fail';
export const CHANGE_RECEIVER_SUCCESS = '[Invoicing] Change Receiver Success';

export class ChangeReceiver implements Action {
  readonly type = CHANGE_RECEIVER;
  constructor(public payload: ReceiverData) {
  }
}

export class ChangeReceiverFail implements Action {
  readonly type = CHANGE_RECEIVER_FAIL;
  constructor(public payload: any) {
  }
}

export class ChangeReceiverSuccess implements Action {
  readonly type = CHANGE_RECEIVER_SUCCESS;
  constructor(public payload: ReceiverData) {
  }
}

export type ReceiverAction =
  CreateReceiver | CreateReceiverFail | CreateReceiverSuccess |
  DeleteReceiver | DeleteReceiverFail | DeleteReceiverSuccess |
  CopyReceiver | CopyReceiverFail | CopyReceiverSuccess |
  NewReceiver | NewReceiverFail | NewReceiverSuccess |
  SelectReceiver | SelectReceiverFail | SelectReceiverSuccess |
  ChangeReceiver | ChangeReceiverFail | ChangeReceiverSuccess |
  QueryReceivers | AddedReceiver | ModifiedReceiver | RemovedReceiver |
  UpdateReceiver | UpdateReceiverFail | UpdateReceiverSuccess;


