import {Injectable} from '@angular/core';
import {ReceiverData} from '../models/receiver.model';
import {AngularFirestore} from 'angularfire2/firestore';
import {ObjectsApiService, OrderByOption} from './objects-api.service';

@Injectable()
export class ReceiversService extends ObjectsApiService<ReceiverData> {

  static readonly COLLECTION_NAME = 'receivers';
  static readonly COLLECTION_ORDERBY: OrderByOption = { fieldName: 'id', direction: 'asc' };

  constructor(protected afs: AngularFirestore) {
     super(afs, ReceiversService.COLLECTION_NAME, ReceiversService.COLLECTION_ORDERBY);
  }
}
