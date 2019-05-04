import {Injectable} from '@angular/core';
import {ObjectsApiService} from './objects-api.service';
import {OrderByOption} from '../../shared/models/order-by-option';
import {FbStoreService} from '../../shared/services/fb-store.service';
import {ContractData, ContractTermFactory} from 'jovisco-domain';

@Injectable()
export class ContractsService extends ObjectsApiService<ContractData> {

  static readonly COLLECTION_NAME = 'contracts';
  static readonly COLLECTION_ORDERBY: OrderByOption = { fieldName: 'issuedAt', direction: 'desc' };

  static mapToBDO(payload: any): ContractData {
    const term = ContractTermFactory.fromDates(payload.startDate, payload.endDate);
    const { startDate: ignore1, endDate: ignore2, ...data} = payload;
    return {
      ...data,
      term
    };
  }

  static mapToDTO(payload: ContractData): any {
    const { term: ignore1, ...data } = payload;
    return {
      ...data,
      startDate: payload.term.startDate,
      endDate: payload.term.endDate
    };
  }

  constructor(protected fbStore: FbStoreService) {
    super(fbStore, ContractsService.COLLECTION_NAME, ContractsService.COLLECTION_ORDERBY);
  }


}
