import {from, Observable} from 'rxjs/index';
import {DocumentChangeAction} from '@angular/fire/firestore';
import {MessageContent, Messages} from '../../shared/models/message.model';
import {INVOICING_MSGS} from '../invoicing-error-messages';
import {BusinessObjectHeaderData} from '../models/business-object';
import {CustomizingHeaderData} from '../models/customizing.model';
import {ReportingHeaderData} from '../models/reporting.model';
import {FbStoreService} from '../../shared/services/fb-store.service';
import {OrderByOption} from '../../shared/models/order-by-option';

export abstract class ObjectsApiService<T extends BusinessObjectHeaderData | CustomizingHeaderData | ReportingHeaderData> {

  col: string;
  messages: Messages;

  protected constructor(protected fbStore: FbStoreService,
                        protected collectionName: string,
                        protected collectionOrderBy?: OrderByOption) {
    this.col = this.fbStore.assignCollection(collectionName, collectionOrderBy);
    this.messages = new Messages(INVOICING_MSGS);
  }

  queryAll(): Observable<DocumentChangeAction<any>[]> {
    return this.fbStore.queryAll(this.col);
  }

  create(payload: T): Observable<any> {
    return from(
      // check if document already exists
      this.fbStore.documentExists(this.col, payload).then(exists => {
        if (exists) {
          throw new Error(`Document with id ${payload.id} already exists. Check number ranges.`);
        }
        // create document & update number range in batch write
        return this.fbStore.createDocument(this.col, payload);
      }));
  }

  delete(payload: T): Observable<any> {
    return from(
      // check if document exists
      this.fbStore.documentExists(this.col, payload).then(exists => {
        if (!exists) {
          throw new Error(`Document with id ${payload.id} does not exist.`);
        }
        // delete document & update number range in batch write - if necessary
        return this.fbStore.deleteDocument(this.col, payload);
      }));
  }

  update(payload: T): Observable<any> {
    return this.fbStore.updateDocument(this.col, payload);
  }

  getMessage(id: string, params?: string[]): MessageContent {
    if (params && params.length > 0) {
      return this.messages.getMessageWithParams(id, params);
    }
    return this.messages.getMessage(id);
  }
}
