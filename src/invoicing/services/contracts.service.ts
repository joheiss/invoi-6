import {Injectable} from '@angular/core';
import {ContractData} from '../models/contract.model';
import {AngularFirestore} from 'angularfire2/firestore';
import {ObjectsApiService, OrderByOption} from './objects-api.service';

@Injectable()
export class ContractsService extends ObjectsApiService<ContractData> {

  static readonly COLLECTION_NAME = 'contracts';
  static readonly COLLECTION_ORDERBY: OrderByOption = { fieldName: 'issuedAt', direction: 'desc' };

  constructor(protected afs: AngularFirestore) {
    super(afs, ContractsService.COLLECTION_NAME, ContractsService.COLLECTION_ORDERBY);
  }
}
