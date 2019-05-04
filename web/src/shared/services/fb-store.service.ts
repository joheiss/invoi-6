import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, DocumentChangeAction} from '@angular/fire/firestore';
import {from, Observable, throwError} from 'rxjs/index';
import {catchError} from 'rxjs/operators';
import {OrderByOption} from '../models/order-by-option';
import {SharedModule} from '../shared.module';
import {DocumentLinkData, UserData, UserProfileData} from 'jovisco-domain';

@Injectable({
  providedIn: SharedModule
})
export class FbStoreService {

  collections: { [key: string]: AngularFirestoreCollection<any> } = {};

  constructor(private afStore: AngularFirestore) {
  }

  /* --- generic --- */
  assignCollection(collectionName: string, collectionOrderBy?: OrderByOption): string {
    if (this.collections[collectionName]) {
      return collectionName;
    }

    let col;
    if (collectionOrderBy) {
      col = this.afStore.collection(collectionName, ref => ref
        .orderBy(collectionOrderBy.fieldName, collectionOrderBy.direction));
    } else {
      col = this.afStore.collection(collectionName);
    }
    this.collections[collectionName] = col;
    return collectionName;
  }

  /* --- generic ---*/
  queryAll(collectionName: string): Observable<DocumentChangeAction<any>[]> {
    return this.collections[collectionName].stateChanges()
      .pipe(
        catchError((err, caught) => [])
      );
  }

  async documentExists(collectionName: string, payload: any): Promise<boolean> {
    try {
      return await this.afStore.firestore.doc(`${collectionName}/${payload.id}`).get()
        .then(docSnapShot => docSnapShot.exists);
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  createDocument(collectionName: string, payload: any): Promise<any> {
    const updates = Object.assign({}, payload);
    Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);
    const batch = this.afStore.firestore.batch();
    const docRef = this.afStore.collection(collectionName).doc(updates.id).ref;
    batch.set(docRef, updates);
    const nrId = this.getNumberRangeId(collectionName, updates);
    if (nrId) {
      const nrRef = this.afStore.collection('number-ranges').doc(nrId).ref;
      batch.update(nrRef, {lastUsedId: updates.id});
    }
    return batch.commit()
      .then(() => updates)
      .catch(err => {
        console.error(err);
        throw new Error(err);
      });
  }

  deleteDocument(collectionName, payload: any): Promise<any> {
    const doc = this.afStore.firestore.doc(`${collectionName}/${payload.id}`);
    const nrId = this.getNumberRangeId(collectionName, payload);
    if (nrId) {
      const nrDoc = this.afStore.firestore.doc(`number-ranges/${nrId}`);
      const batch = this.afStore.firestore.batch();
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

  updateDocument(collectionName: string, payload: any): Observable<any> {
    const updates = Object.assign({}, payload);
    Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);
    const ref = this.afStore.doc<any>(`${collectionName}/${updates.id}`);
    return from(
      ref.update(updates)
        .then(() => updates)
        .catch(err => {
          console.error(err);
          throw new Error(err);
        })
    );
  }

  /* --- document links ---*/
  queryAllDocumentLinksForObject(payload: any): Observable<DocumentChangeAction<any>[]> {
    const owner = `${payload.objectType}/${payload.id}`;
    const collection = this.afStore.collection('document-links', ref => ref.where('owner', '==', owner));
    return collection.stateChanges().pipe(
      catchError((err, caught) => [])
    );
  }

  createDocumentLink(payload: DocumentLinkData): Observable<any> {
    const {$id: removed, ...documentLink} = payload;
    return from(
      this.collections['document-links'].add(documentLink)
        .then(ref => {
          return {$id: ref.id, ...documentLink};
        })
        .catch(err => {
          throw new Error(err);
        })
    );
  }

  /* --- user-profiles ---*/
  deleteOneUser(payload: UserData): Observable<any> {
    const ref = this.afStore.doc<UserData>(`user-profiles/${payload.uid}`);
    return from(
      ref.delete()
        .then(() => payload)
        .catch(err => throwError(err))
    );
  }

  getOneUserProfile(uid: string): Observable<any> {
    return from(this.afStore.collection('user-profiles').doc(uid).ref.get());
  }

  queryAllUsers(): Observable<DocumentChangeAction<any>[]> {
    return this.afStore.collection('user-profiles').stateChanges();
  }

  queryOneUser(uid: string): Observable<DocumentChangeAction<any>[]> {
    return this.afStore.collection('user-profiles').stateChanges();
  }

  updateOneUserProfile(payload: UserProfileData): Observable<any> {
    const ref = this.afStore.doc<UserProfileData>(`user-profiles/${payload.uid}`);
    const updates = Object.assign({}, payload);
    delete updates['uid'];
    return from(
      ref.update(updates)
        .then(() => payload)
        .catch(err => throwError(err))
    );
  }

  private getNumberRangeId(collectionName: string, payload: any): string {
    if (collectionName === 'invoices') {
      return payload['billingMethod'] === 0 ? 'invoices' : 'credit-requests';
    } else if (collectionName === 'receivers' || collectionName === 'contracts') {
      return collectionName;
    }
    return null;
  }
}
