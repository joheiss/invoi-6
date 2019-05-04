import {Injectable} from '@angular/core';
import {ObjectsApiService} from './objects-api.service';
import {OrderByOption} from '../../shared/models/order-by-option';
import {FbStoreService} from '../../shared/services/fb-store.service';
import {RevenueData} from 'jovisco-domain';

@Injectable()
export class RevenuesService extends ObjectsApiService<RevenueData> {

  static readonly COLLECTION_NAME = 'revenues';
  static readonly COLLECTION_ORDERBY: OrderByOption = { fieldName: 'id', direction: 'desc' };

  constructor(protected fbStore: FbStoreService) {
    super(fbStore, RevenuesService.COLLECTION_NAME, RevenuesService.COLLECTION_ORDERBY);
  }
}

