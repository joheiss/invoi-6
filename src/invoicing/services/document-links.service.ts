import {Injectable} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {ObjectsApiService, OrderByOption} from './objects-api.service';
import {DocumentLink} from '../models/document-link';
import {Observable} from 'rxjs/Observable';
import {DocumentChangeAction} from 'angularfire2/firestore';
import {catchError} from 'rxjs/operators';
import {from} from 'rxjs/index';

@Injectable()
export class DocumentLinksService extends ObjectsApiService<DocumentLink> {

  static readonly COLLECTION_NAME = 'document-links';
  static readonly COLLECTION_ORDERBY: OrderByOption = {fieldName: 'path', direction: 'asc'};

  constructor(protected afs: AngularFirestore) {
    super(afs, DocumentLinksService.COLLECTION_NAME, DocumentLinksService.COLLECTION_ORDERBY);
  }

  queryForObject(payload): Observable<DocumentChangeAction<any>[]> {
    console.log('QueryForObject: ', payload);
    const owner = `${payload.objectType}/${payload.id}`;
    const collection = this.afs.collection(DocumentLinksService.COLLECTION_NAME, ref => ref.where('owner', '==', owner));
    return collection.stateChanges().pipe(
      catchError((err, caught) => [])
    );
  }

  create(payload: DocumentLink): Observable<any> {
    const {$id: removed, ...documentLink} = payload;
    return from(
      this.col.add(documentLink)
        .then(ref => {
          return {$id: ref.id, ...documentLink};
        })
        .catch(err => {
          throw new Error(err);
        })
    );
  }

}
