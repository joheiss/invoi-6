import {Injectable} from '@angular/core';
import {ContractData} from '../models/contract.model';
import {ObjectsApiService} from './objects-api.service';
import {OrderByOption} from '../../shared/models/order-by-option';
import {FbStoreService} from '../../shared/services/fb-store.service';

@Injectable()
export class ContractsService extends ObjectsApiService<ContractData> {

  static readonly COLLECTION_NAME = 'contracts';
  static readonly COLLECTION_ORDERBY: OrderByOption = { fieldName: 'issuedAt', direction: 'desc' };

  constructor(protected fbStore: FbStoreService) {
    super(fbStore, ContractsService.COLLECTION_NAME, ContractsService.COLLECTION_ORDERBY);
  }
}
