import {Injectable} from '@angular/core';
import {AngularFirestore, DocumentChangeAction} from 'angularfire2/firestore';
import {from, Observable, throwError} from 'rxjs/index';
import {UserData, UserProfileData} from '../../auth/models/user';

@Injectable()
export class FbStoreService {

  constructor(private afStore: AngularFirestore) {
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


}
