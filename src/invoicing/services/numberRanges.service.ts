import {Injectable} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {NumberRangeData} from '../models/number-range.model';
import {ObjectsApiService} from './objects-api.service';

@Injectable()
export class NumberRangesService extends ObjectsApiService<NumberRangeData> {

  static readonly COLLECTION_NAME = 'number-ranges';

  constructor(protected afs: AngularFirestore) {
    super(afs, NumberRangesService.COLLECTION_NAME);
  }
}
