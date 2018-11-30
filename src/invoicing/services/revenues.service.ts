import {Injectable} from '@angular/core';
import {ObjectsApiService} from './objects-api.service';
import {OrderByOption} from '../../shared/models/order-by-option';
import {RevenueData} from '../models/revenue.model';
import {FbStoreService} from '../../shared/services/fb-store.service';

@Injectable({
  providedIn: 'root'
})
export class RevenuesService extends ObjectsApiService<RevenueData> {

  static readonly COLLECTION_NAME = 'revenues';
  static readonly COLLECTION_ORDERBY: OrderByOption = { fieldName: 'id', direction: 'desc' };

  constructor(protected fbStore: FbStoreService) {
    super(fbStore, RevenuesService.COLLECTION_NAME, RevenuesService.COLLECTION_ORDERBY);
  }
}

