import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, DocumentChangeAction} from 'angularfire2/firestore';
import {UserData, UserProfileData} from '../models/user';
import {from, Observable, throwError} from 'rxjs/index';
import {catchError, map, tap} from 'rxjs/operators';
import {AUTH_MSGS} from '../auth-error-messages';
import {MessageContent, Messages} from '../../shared/models/message.model';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class UsersService {

  col: AngularFirestoreCollection<UserProfileData>;
  messages: Messages;

  constructor(private afs: AngularFirestore,
              private http: HttpClient) {
    this.col = this.afs.collection('user-profiles');
    this.messages = new Messages(AUTH_MSGS);
  }

  queryAll(): Observable<DocumentChangeAction<any>[]> {
    return this.col.stateChanges().pipe(
      catchError((err, caught) => [])
    );
  }

  queryOne(uid: string): Observable<DocumentChangeAction<any>[]> {
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
        catchError((error: any) => throwError(error))
      );
  }

  delete(payload: UserData): Observable<any> {
    const ref = this.afs.doc<UserData>(`user-profiles/${payload.uid}`);
    return from(
      ref.delete()
        .then(() => payload)
        .catch(err => throwError(err))
    );
  }

    update(payload: { user: UserData, password: string }): Observable<UserData> {
    const url = `https://us-central1-jovisco-invoicing.cloudfunctions.net/users/${payload.user.uid}`;
    return this.http
      .post<any>(url, payload)
      .pipe(
        tap(response => console.log('RESPONSE FROM UPDATE USER: ', response)),
        catchError((error: any) => throwError(error))
      );
  }

  updateProfile(payload: UserProfileData): Observable<any> {
    const ref = this.afs.doc<UserProfileData>(`user-profiles/${payload.uid}`);
    const updates = Object.assign({}, payload);
    delete updates['uid'];
    return from(
      ref.update(updates)
        .then(() => payload)
        .catch(err => throwError(err))
    );
  }

  getMessage(id: string, params?: string[]): MessageContent {
    if (params && params.length > 0) {
      return this.messages.getMessageWithParams(id, params);
    }
    return this.messages.getMessage(id);
  }

}
