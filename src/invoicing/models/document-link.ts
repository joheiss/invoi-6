import {DataObject} from './data-object';

export enum DocumentLinkType {
  Invoice,
  CreditRequest,
  ProjectContract,
  MasterContract,
  TravelExpenses,
  ServiceConfirmation,
  Other
}

export interface DocumentLink extends DataObject {
  $id?: string;
  id?: string;
  name: string;
  path: string;
  type: DocumentLinkType;
  attachToEmail: boolean;
  owner?: string;
}
