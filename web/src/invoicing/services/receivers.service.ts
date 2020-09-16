import {Injectable} from '@angular/core';
import {ObjectsApiService} from './objects-api.service';
import {OrderByOption} from '../../shared/models/order-by-option';
import {FbStoreService} from '../../shared/services/fb-store.service';
import {ReceiverData} from 'jovisco-domain';

@Injectable()
export class ReceiversService extends ObjectsApiService<ReceiverData> {

  static readonly COLLECTION_NAME = 'receivers';
  static readonly COLLECTION_ORDERBY: OrderByOption = { fieldName: 'id', direction: 'asc' };

  constructor(protected fbStore: FbStoreService) {
     super(fbStore, ReceiversService.COLLECTION_NAME, ReceiversService.COLLECTION_ORDERBY);
  }
}
