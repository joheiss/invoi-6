export enum DocumentLinkType {
  Invoice,
  CreditRequest,
  ProjectContract,
  MasterContract,
  TravelExpenses,
  ServiceConfirmation,
  Other
}

export interface DocumentLink {
  $id?: string;
  id?: string;
  name: string;
  path: string;
  type: DocumentLinkType;
  attachToEmail: boolean;
  owner?: string;
}
