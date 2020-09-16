import {Injectable} from '@angular/core';
import {ObjectsApiService} from './objects-api.service';
import {FbStoreService} from '../../shared/services/fb-store.service';
import {NumberRangeData} from 'jovisco-domain';

@Injectable()
export class NumberRangesService extends ObjectsApiService<NumberRangeData> {

  static readonly COLLECTION_NAME = 'number-ranges';

  constructor(protected fbStore: FbStoreService) {
    super(fbStore, NumberRangesService.COLLECTION_NAME);
  }
}
