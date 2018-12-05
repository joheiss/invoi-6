import {Injectable} from '@angular/core';
import {DocumentChangeAction} from '@angular/fire/firestore';
import {ObjectsApiService} from './objects-api.service';
import {DocumentLink} from '../models/document-link';
import {Observable} from 'rxjs/index';
import {OrderByOption} from '../../shared/models/order-by-option';
import {FbStoreService} from '../../shared/services/fb-store.service';

@Injectable()
export class DocumentLinksService extends ObjectsApiService<DocumentLink> {

  static readonly COLLECTION_NAME = 'document-links';
  static readonly COLLECTION_ORDERBY: OrderByOption = {fieldName: 'path', direction: 'asc'};

  constructor(protected fbStore: FbStoreService) {
    super(fbStore, DocumentLinksService.COLLECTION_NAME, DocumentLinksService.COLLECTION_ORDERBY);
  }

  queryForObject(payload: any): Observable<DocumentChangeAction<any>[]> {
    return this.fbStore.queryAllDocumentLinksForObject(payload);
  }

  create(payload: DocumentLink): Observable<any> {
    return this.fbStore.createDocumentLink(payload);
  }

}
