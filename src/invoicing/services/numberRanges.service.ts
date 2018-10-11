import {Injectable} from '@angular/core';
import {NumberRangeData} from '../models/number-range.model';
import {ObjectsApiService} from './objects-api.service';
import {FbStoreService} from '../../shared/services/fb-store.service';

@Injectable()
export class NumberRangesService extends ObjectsApiService<NumberRangeData> {

  static readonly COLLECTION_NAME = 'number-ranges';

  constructor(protected fbStore: FbStoreService) {
    super(fbStore, NumberRangesService.COLLECTION_NAME);
  }
}
