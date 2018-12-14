import {BusinessObject, BusinessObjectHeaderData} from './business-object';

export interface MasterDataHeader extends BusinessObjectHeaderData {
  status?: MasterDataStatus;
}

export enum MasterDataStatus {
  active,
  inactive
}

export abstract class MasterData extends BusinessObject {
  abstract header?: MasterDataHeader;

  abstract get data(): any;
}
