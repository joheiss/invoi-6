import {Action} from '@ngrx/store';
import {DocumentLinkData} from 'jovisco-domain';

// FIRESTORE
export const QUERY_DOCUMENT_LINKS = '[Invoicing] Document Links query';
export const QUERY_DOCUMENT_LINKS_FOR_OBJECT = '[Invoicing] Document Links for object query';
export const ADDED_DOCUMENT_LINK = '[Invoicing] Document Link added';
export const MODIFIED_DOCUMENT_LINK = '[Invoicing] Document Link modified';
export const REMOVED_DOCUMENT_LINK = '[Invoicing] Document Link removed';
export const UPDATE_DOCUMENT_LINK = '[Invoicing] Document Link update';
export const UPDATE_DOCUMENT_LINK_FAIL = '[Invoicing] Document Link update fail';
export const UPDATE_DOCUMENT_LINK_SUCCESS = '[Invoicing] Document Link update success';

export class QueryDocumentLinks implements Action {
  readonly type = QUERY_DOCUMENT_LINKS;
  constructor() {}
}

export class QueryDocumentLinksForObject implements Action {
  readonly type = QUERY_DOCUMENT_LINKS_FOR_OBJECT;
  constructor(public payload: { objectType: string, id: string }) {}
}

export class AddedDocumentLink implements Action {
  readonly type = ADDED_DOCUMENT_LINK;
  constructor(public payload: DocumentLinkData) {}
}

export class ModifiedDocumentLink implements Action {
  readonly type = MODIFIED_DOCUMENT_LINK;
  constructor(public payload: DocumentLinkData) {}
}

export class RemovedDocumentLink implements Action {
  readonly type = REMOVED_DOCUMENT_LINK;
  constructor(public payload: DocumentLinkData) {}
}

export class UpdateDocumentLink implements Action {
  readonly type = UPDATE_DOCUMENT_LINK;
  constructor(public payload: DocumentLinkData) {}
}

export class UpdateDocumentLinkFail implements Action {
  readonly type = UPDATE_DOCUMENT_LINK_FAIL;
  constructor(public payload: any) {}
}

export class UpdateDocumentLinkSuccess implements Action {
  readonly type = UPDATE_DOCUMENT_LINK_SUCCESS;
  constructor(public payload: DocumentLinkData) {}
}

// CREATING
export const CREATE_DOCUMENT_LINK = '[Invoicing] Create DocumentLink';
export const CREATE_DOCUMENT_LINK_FAIL = '[Invoicing] Create DocumentLink Fail';
export const CREATE_DOCUMENT_LINK_SUCCESS = '[Invoicing] Create DocumentLink Success';

export class CreateDocumentLink implements Action {
  readonly type = CREATE_DOCUMENT_LINK;
  constructor(public payload: DocumentLinkData) {
  }
}

export class CreateDocumentLinkFail implements Action {
  readonly type = CREATE_DOCUMENT_LINK_FAIL;
  constructor(public payload: any) {
  }
}

export class CreateDocumentLinkSuccess implements Action {
  readonly type = CREATE_DOCUMENT_LINK_SUCCESS;
  constructor(public payload: DocumentLinkData) {
  }
}

// DELETING
export const DELETE_DOCUMENT_LINK = '[Invoicing] Delete DocumentLink';
export const DELETE_DOCUMENT_LINK_FAIL = '[Invoicing] Delete DocumentLink Fail';
export const DELETE_DOCUMENT_LINK_SUCCESS = '[Invoicing] Delete DocumentLink Success';

export class DeleteDocumentLink implements Action {
  readonly type = DELETE_DOCUMENT_LINK;
  constructor(public payload: DocumentLinkData) {
  }
}

export class DeleteDocumentLinkFail implements Action {
  readonly type = DELETE_DOCUMENT_LINK_FAIL;
  constructor(public payload: any) {
  }
}

export class DeleteDocumentLinkSuccess implements Action {
  readonly type = DELETE_DOCUMENT_LINK_SUCCESS;
  constructor(public payload: DocumentLinkData) {
  }
}

// NEW
export const NEW_DOCUMENT_LINK = '[Invoicing] New DocumentLink';
export const NEW_DOCUMENT_LINK_FAIL = '[Invoicing] New DocumentLink Fail';
export const NEW_DOCUMENT_LINK_SUCCESS = '[Invoicing] New DocumentLink Success';

export class NewDocumentLink implements Action {
  readonly type = NEW_DOCUMENT_LINK;
  constructor() {
  }
}

export class NewDocumentLinkFail implements Action {
  readonly type = NEW_DOCUMENT_LINK_FAIL;
  constructor(public payload: any) {
  }
}

export class NewDocumentLinkSuccess implements Action {
  readonly type = NEW_DOCUMENT_LINK_SUCCESS;
  constructor(public payload: DocumentLinkData) {
  }
}

// CHANGE
export const CHANGE_DOCUMENT_LINK = '[Invoicing] Change DocumentLink';
export const CHANGE_DOCUMENT_LINK_FAIL = '[Invoicing] Change DocumentLink Fail';
export const CHANGE_DOCUMENT_LINK_SUCCESS = '[Invoicing] Change DocumentLink Success';

export class ChangeDocumentLink implements Action {
  readonly type = CHANGE_DOCUMENT_LINK;
  constructor(public payload: DocumentLinkData) {
  }
}

export class ChangeDocumentLinkFail implements Action {
  readonly type = CHANGE_DOCUMENT_LINK_FAIL;
  constructor(public payload: any) {
  }
}

export class ChangeDocumentLinkSuccess implements Action {
  readonly type = CHANGE_DOCUMENT_LINK_SUCCESS;
  constructor(public payload: DocumentLinkData) {
  }
}

export type DocumentLinkAction =
  QueryDocumentLinks | AddedDocumentLink | ModifiedDocumentLink | RemovedDocumentLink |
  UpdateDocumentLink | UpdateDocumentLinkFail | UpdateDocumentLinkSuccess |
  CreateDocumentLink | CreateDocumentLinkFail | CreateDocumentLinkSuccess |
  DeleteDocumentLink | DeleteDocumentLinkFail | DeleteDocumentLinkSuccess |
  ChangeDocumentLink | ChangeDocumentLinkFail | ChangeDocumentLinkSuccess |
  NewDocumentLink | NewDocumentLinkFail | NewDocumentLinkSuccess;


