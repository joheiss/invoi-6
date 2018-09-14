import {Observable} from 'rxjs/Observable';
import {catchError} from 'rxjs/operators';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {DocumentChangeAction} from 'angularfire2/firestore/interfaces';
import {MessageContent, Messages} from '../../shared/models/message.model';
import {INVOICING_MSGS} from '../invoicing-error-messages';
import {BusinessObjectHeaderData} from '../models/business-object';
import {CustomizingHeaderData} from '../models/customizing.model';
import {ReportingHeaderData} from '../models/reporting.model';

export type OrderByOption = { fieldName: string, direction: 'asc' | 'desc' };

export abstract class ObjectsApiService<T extends BusinessObjectHeaderData | CustomizingHeaderData | ReportingHeaderData> {
  col: AngularFirestoreCollection<T>;
  messages: Messages;

  constructor(protected afs: AngularFirestore,
              protected collectionName: string,
              protected collectionOrderBy?: OrderByOption) {
    if (collectionOrderBy) {
      this.col = afs.collection(collectionName, ref => ref
        .orderBy(collectionOrderBy.fieldName, collectionOrderBy.direction));
    } else {
      this.col = afs.collection(collectionName);
    }
    this.messages = new Messages(INVOICING_MSGS);
  }

  queryAll(): Observable<DocumentChangeAction[]> {
    return this.col.stateChanges()
      .pipe(
        catchError((err, caught) => [])
      );
  }

  create(payload: T): Observable<any> {
    return Observable.fromPromise(
      this.afs.collection(this.collectionName).doc(payload.id).set(payload)
        .then(() => payload)
        .catch(err => {
          console.error(err);
          throw new Error(err);
        })
    );
  }

  delete(payload: T): Observable<any> {
    const ref = this.afs.doc<T>(`${this.collectionName}/${payload.id}`);
    return Observable.fromPromise(
      ref.delete()
        .then(() => payload)
        .catch(err => {
          console.error(err);
          throw new Error(err);
        })
    );
  }

  update(payload: T): Observable<any> {

    const ref = this.afs.doc<T>(`${this.collectionName}/${payload.id}`);
    return Observable.fromPromise(
      ref.update(payload)
        .then(() => payload)
        .catch(err => {
          console.error(err);
          throw new Error(err);
        })
    );
  }

  getMessage(id: string, params?: string[]): MessageContent {
    if (params && params.length > 0) {
      return this.messages.getMessageWithParams(id, params);
    }
    return this.messages.getMessage(id);
  }
}
