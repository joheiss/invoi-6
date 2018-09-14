import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {UserData, UserProfileData} from '../models/user';
import {Observable} from 'rxjs/Observable';
import {catchError, filter, map, mergeMap, take, tap} from 'rxjs/operators';
import {AUTH_MSGS} from '../auth-error-messages';
import {MessageContent, Messages} from '../../shared/models/message.model';
import {_throw} from 'rxjs/observable/throw';
import {DocumentChangeAction} from 'angularfire2/firestore/interfaces';
import {HttpClient} from '@angular/common/http';
import {of} from 'rxjs/observable/of';
import * as firebase from 'firebase/app';
import DocumentChangeType = firebase.firestore.DocumentChangeType;

@Injectable()
export class UsersService {

  col: AngularFirestoreCollection<UserProfileData>;
  messages: Messages;

  constructor(private afs: AngularFirestore,
              private http: HttpClient) {
    this.col = this.afs.collection('user-profiles');
    this.messages = new Messages(AUTH_MSGS);
  }

  queryAll(): Observable<DocumentChangeAction[]> {
    return this.col.stateChanges().pipe(
      catchError((err, caught) => [])
    );
  }

  queryOne(uid: string): Observable<DocumentChangeAction[]> {
    return this.col.stateChanges()
      .pipe(
        map(actions => actions.filter(action => action.payload.doc.id === uid)),
        tap(actions => console.log('QueryOne: ', actions)),
        catchError((err, caught) => [])
      );
  }

  create(payload: { user: UserData, password: string }): Observable<UserData> {
    const url = `https://us-central1-jovisco-invoicing.cloudfunctions.net/users/new`;
    return this.http
      .post<any>(url, payload)
      .pipe(
        tap(response => console.log('RESPONSE FROM CREATE USER: ', response)),
        catchError((error: any) => _throw(error))
      );
  }

  delete(payload: UserData): Observable<any> {
    const ref = this.afs.doc<UserData>(`user-profiles/${payload.uid}`);
    return Observable.fromPromise(
      ref.delete()
        .then(() => payload)
        .catch(err => _throw(err))
    );
  }

    update(payload: { user: UserData, password: string }): Observable<UserData> {
    const url = `https://us-central1-jovisco-invoicing.cloudfunctions.net/users/${payload.user.uid}`;
    return this.http
      .post<any>(url, payload)
      .pipe(
        tap(response => console.log('RESPONSE FROM UPDATE USER: ', response)),
        catchError((error: any) => _throw(error))
      );
  }

  updateProfile(payload: UserProfileData): Observable<any> {
    const ref = this.afs.doc<UserProfileData>(`user-profiles/${payload.uid}`);
    const updates = Object.assign({}, payload);
    delete updates['uid'];
    return Observable.fromPromise(
      ref.update(updates)
        .then(() => payload)
        .catch(err => _throw(err))
    );
  }

  getMessage(id: string, params?: string[]): MessageContent {
    if (params && params.length > 0) {
      return this.messages.getMessageWithParams(id, params);
    }
    return this.messages.getMessage(id);
  }

}
