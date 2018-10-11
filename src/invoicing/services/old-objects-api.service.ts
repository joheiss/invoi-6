import {from, Observable, throwError} from 'rxjs/index';
import {catchError} from 'rxjs/operators';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {DocumentChangeAction} from 'angularfire2/firestore';
import {MessageContent, Messages} from '../../shared/models/message.model';
import {INVOICING_MSGS} from '../invoicing-error-messages';
import {BusinessObjectHeaderData} from '../models/business-object';
import {CustomizingHeaderData} from '../models/customizing.model';
import {ReportingHeaderData} from '../models/reporting.model';
import {OrderByOption} from '../../shared/models/order-by-option';

export abstract class ObjectsApiService<T extends BusinessObjectHeaderData | CustomizingHeaderData | ReportingHeaderData> {
  col: AngularFirestoreCollection<T>;
  messages: Messages;

  protected constructor(protected afs: AngularFirestore,
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

  queryAll(): Observable<DocumentChangeAction<any>[]> {
    return this.col.stateChanges()
      .pipe(
        catchError((err, caught) => [])
      );
  }

  create(payload: T): Observable<any> {
    return from(
      // check if document already exists
      this.documentExists(payload).then(exists => {
        if (exists) {
          throw new Error(`Document with id ${payload.id} already exists. Check number ranges.`);
        }
        // create document & update number range in batch write
        return this.createDocument(payload);
      }));
  }

  delete(payload: T): Observable<any> {
    return from(
      // check if document exists
      this.documentExists(payload).then(exists => {
        if (!exists) {
          throw new Error(`Document with id ${payload.id} does not exist.`);
        }
        // delete document & update number range in batch write - if necessary
        return this.deleteDocument(payload);
      }));
  }

  update(payload: T): Observable<any> {

    const ref = this.afs.doc<T>(`${this.collectionName}/${payload.id}`);
    return from(
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

  private createDocument(payload: T): Promise<any> {
    const batch = this.afs.firestore.batch();
    const docRef = this.afs.collection(this.collectionName).doc(payload.id).ref;
    batch.set(docRef, payload);
    const nrId = this.getNumberRangeId(payload);
    if (nrId) {
      const nrRef = this.afs.collection('number-ranges').doc(nrId).ref;
      batch.update(nrRef, {lastUsedId: payload.id});
    }
    return batch.commit()
      .then(() => payload)
      .catch(err => {
        console.error(err);
        throw new Error(err);
      });
  }

  private deleteDocument(payload: T): Promise<any> {
    const doc = this.afs.firestore.doc(`${this.collectionName}/${payload.id}`);
    const nrId = this.getNumberRangeId(payload);
    if (nrId) {
      const nrDoc = this.afs.firestore.doc(`number-ranges/${nrId}`);
      const batch = this.afs.firestore.batch();
      return nrDoc.get()
        .then(docSnapShot => {
          if (docSnapShot.data().lastUsedId === payload.id) {
            const lastUsedId = (+payload.id - 1).toString();
            batch.update(nrDoc, { lastUsedId: lastUsedId });
          }
          batch.delete(doc);
          return batch.commit()
            .then(() => payload)
            .catch(err => {
              console.error(err);
              throw new Error(err);
            });
        });
    } else {
      return doc.delete()
        .then(() => payload)
        .catch(err => {
          console.error(err);
          throw new Error(err);
        });
    }
  }

  private async documentExists(payload: T): Promise<boolean> {
    try {
      return await this.afs.firestore.doc(`${this.collectionName}/${payload.id}`).get()
        .then(docSnapShot => docSnapShot.exists);
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  private getNumberRangeId(payload: T): string {
    if (this.collectionName === 'invoices') {
      return payload['billingMethod'] === 0 ? 'invoices' : 'credit-requests';
    } else if (this.collectionName === 'receivers' || this.collectionName === 'contracts') {
      return this.collectionName;
    }
    return null;
  }
}
