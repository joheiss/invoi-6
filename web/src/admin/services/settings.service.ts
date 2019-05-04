import {Injectable} from '@angular/core';
import {ObjectsApiService} from '../../invoicing/services/objects-api.service';
import {OrderByOption} from '../../shared/models/order-by-option';
import {FbStoreService} from '../../shared/services/fb-store.service';
import {SettingData} from 'jovisco-domain';

@Injectable()
export class SettingsService extends ObjectsApiService<SettingData> {

  static readonly COLLECTION_NAME = 'settings';
  static readonly COLLECTION_ORDERBY: OrderByOption = { fieldName: 'id', direction: 'asc' };

  constructor(protected fbStore: FbStoreService) {
    super(fbStore, SettingsService.COLLECTION_NAME, SettingsService.COLLECTION_ORDERBY);
  }
}
