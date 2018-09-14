import {Action} from '@ngrx/store';
import {ContractData} from '../../models/contract.model';

// FIRESTORE
export const QUERY_CONTRACTS = '[Invoicing] Contracts query';
export const ADDED_CONTRACT = '[Invoicing] Contract added';
export const MODIFIED_CONTRACT = '[Invoicing] Contract modified';
export const REMOVED_CONTRACT = '[Invoicing] Contract removed';
export const UPDATE_CONTRACT = '[Invoicing] Contract update';
export const UPDATE_CONTRACT_SUCCESS = '[Invoicing] Contract update success';
export const UPDATE_CONTRACT_FAIL = '[Invoicing] Contract update fail';

export class QueryContracts implements Action {
  readonly type = QUERY_CONTRACTS;
  constructor(public payload?: any) {}
}

export class AddedContract implements Action {
  readonly type = ADDED_CONTRACT;
  constructor(public payload: ContractData) {}
}

export class ModifiedContract implements Action {
  readonly type = MODIFIED_CONTRACT;
  constructor(public payload: ContractData) {}
}

export class RemovedContract implements Action {
  readonly type = REMOVED_CONTRACT;
  constructor(public payload: ContractData) {}
}

export class UpdateContract implements Action {
  readonly type = UPDATE_CONTRACT;
  constructor(public payload: ContractData) {}
}

export class UpdateContractSuccess implements Action {
  readonly type = UPDATE_CONTRACT_SUCCESS;
  constructor(public payload: ContractData) {}
}

export class UpdateContractFail implements Action {
  readonly type = UPDATE_CONTRACT_FAIL;
  constructor(public payload: any) {
  }
}

// CREATING
export const CREATE_CONTRACT = '[Invoicing] Create Contract';
export const CREATE_CONTRACT_FAIL = '[Invoicing] Create Contract Fail';
export const CREATE_CONTRACT_SUCCESS = '[Invoicing] Create Contract Success';

export class CreateContract implements Action {
  readonly type = CREATE_CONTRACT;
  constructor(public payload: ContractData) {
  }
}

export class CreateContractFail implements Action {
  readonly type = CREATE_CONTRACT_FAIL;
  constructor(public payload: any) {
  }
}

export class CreateContractSuccess implements Action {
  readonly type = CREATE_CONTRACT_SUCCESS;
  constructor(public payload: ContractData) {
  }
}

// DELETING
export const DELETE_CONTRACT = '[Invoicing] Delete Contract';
export const DELETE_CONTRACT_FAIL = '[Invoicing] Delete Contract Fail';
export const DELETE_CONTRACT_SUCCESS = '[Invoicing] Delete Contract Success';

export class DeleteContract implements Action {
  readonly type = DELETE_CONTRACT;
  constructor(public payload: ContractData) {
  }
}

export class DeleteContractFail implements Action {
  readonly type = DELETE_CONTRACT_FAIL;
  constructor(public payload: any) {
  }
}

export class DeleteContractSuccess implements Action {
  readonly type = DELETE_CONTRACT_SUCCESS;
  constructor(public payload: ContractData) {
  }
}

// COPYING
export const COPY_CONTRACT = '[Invoicing] Copy Contract';
export const COPY_CONTRACT_FAIL = '[Invoicing] Copy Contract Fail';
export const COPY_CONTRACT_SUCCESS = '[Invoicing] Copy Contract Success';

export class CopyContract implements Action {
  readonly type = COPY_CONTRACT;
  constructor(public payload: ContractData) {
  }
}

export class CopyContractFail implements Action {
  readonly type = COPY_CONTRACT_FAIL;
  constructor(public payload: any) {
  }
}

export class CopyContractSuccess implements Action {
  readonly type = COPY_CONTRACT_SUCCESS;
  constructor(public payload: ContractData) {
  }
}

// NEW
export const NEW_CONTRACT = '[Invoicing] New Contract';
export const NEW_CONTRACT_FAIL = '[Invoicing] New Contract Fail';
export const NEW_CONTRACT_SUCCESS = '[Invoicing] New Contract Success';

export class NewContract implements Action {
  readonly type = NEW_CONTRACT;
  constructor() {
  }
}

export class NewContractFail implements Action {
  readonly type = NEW_CONTRACT_FAIL;
  constructor(public payload: any) {
  }
}

export class NewContractSuccess implements Action {
  readonly type = NEW_CONTRACT_SUCCESS;
  constructor(public payload: ContractData) {
  }
}

// SELECTING
export const SELECT_CONTRACT = '[Invoicing] Select Contract';
export const SELECT_CONTRACT_FAIL = '[Invoicing] Select Contract Fail';
export const SELECT_CONTRACT_SUCCESS = '[Invoicing] Select Contract Success';

export class SelectContract implements Action {
  readonly type = SELECT_CONTRACT;
  constructor(public payload: ContractData) {
  }
}

export class SelectContractFail implements Action {
  readonly type = SELECT_CONTRACT_FAIL;
  constructor(public payload: any) {
  }
}

export class SelectContractSuccess implements Action {
  readonly type = SELECT_CONTRACT_SUCCESS;
  constructor(public payload: ContractData) {
  }
}

// CHANGING
export const CHANGE_CONTRACT = '[Invoicing] Change Contract';
export const CHANGE_CONTRACT_FAIL = '[Invoicing] Change Contract Fail';
export const CHANGE_CONTRACT_SUCCESS = '[Invoicing] Change Contract Success';

export class ChangeContract implements Action {
  readonly type = CHANGE_CONTRACT;
  constructor(public payload: ContractData) {
  }
}

export class ChangeContractFail implements Action {
  readonly type = CHANGE_CONTRACT_FAIL;
  constructor(public payload: any) {
  }
}

export class ChangeContractSuccess implements Action {
  readonly type = CHANGE_CONTRACT_SUCCESS;
  constructor(public payload: ContractData) {
  }
}

// CHANGING
export const REMOVE_ALL_CONTRACTS = '[Invoicing] Remove all contracts';
export class RemoveAllContracts implements Action {
  readonly type = REMOVE_ALL_CONTRACTS;
}

export type ContractAction =
  CreateContract | CreateContractFail | CreateContractSuccess |
  DeleteContract | DeleteContractFail | DeleteContractSuccess |
  CopyContract | CopyContractFail | CopyContractSuccess |
  NewContract | NewContractFail | NewContractSuccess |
  SelectContract | SelectContractFail | SelectContractSuccess |
  ChangeContract | ChangeContractFail | ChangeContractSuccess |
  QueryContracts | AddedContract | ModifiedContract | RemovedContract |
  UpdateContract | UpdateContractFail | UpdateContractSuccess |
  RemoveAllContracts;


