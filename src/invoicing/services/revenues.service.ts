import {Injectable} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {ObjectsApiService, OrderByOption} from './objects-api.service';
import {RevenueData} from '../models/revenue.model';

@Injectable()
export class RevenuesService extends ObjectsApiService<RevenueData> {

  static readonly COLLECTION_NAME = 'revenues';
  static readonly COLLECTION_ORDERBY: OrderByOption = { fieldName: 'id', direction: 'desc' };

  constructor(protected afs: AngularFirestore) {
    super(afs, RevenuesService.COLLECTION_NAME, RevenuesService.COLLECTION_ORDERBY);
  }
}
