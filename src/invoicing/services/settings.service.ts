import {Injectable} from '@angular/core';
import {SettingData} from '../models/setting.model';
import {ObjectsApiService, OrderByOption} from './objects-api.service';
import {AngularFirestore} from 'angularfire2/firestore';

@Injectable()
export class SettingsService extends ObjectsApiService<SettingData> {

  static readonly COLLECTION_NAME = 'settings';
  static readonly COLLECTION_ORDERBY: OrderByOption = { fieldName: 'id', direction: 'asc' };

  constructor(protected afs: AngularFirestore) {
    super(afs, SettingsService.COLLECTION_NAME, SettingsService.COLLECTION_ORDERBY);
  }
}
