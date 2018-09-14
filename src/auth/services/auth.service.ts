import {Injectable} from '@angular/core';
import * as firebase from 'firebase';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {UserCredentials, UserProfileData} from '../models/user';
import {Observable} from 'rxjs/Observable';
import {catchError, filter, map, switchMap, tap} from 'rxjs/operators';
import {fromPromise} from 'rxjs/observable/fromPromise';
import {of} from 'rxjs/observable/of';
import {UiService} from '../../shared/services/ui.service';
import {AUTH_MSGS} from '../auth-error-messages';
import {MessageContent, Messages} from '../../shared/models/message.model';
import {User} from 'firebase/app';
import {_throw} from 'rxjs/observable/throw';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class AuthService {

  col: AngularFirestoreCollection<UserProfileData>;
  messages: Messages;

  constructor(private afAuth: AngularFireAuth,
              private afs: AngularFirestore,
              private http: HttpClient,
              private uiService: UiService) {
    this.col = this.afs.collection('user-profiles');
    this.messages = new Messages(AUTH_MSGS);
  }

  queryAuth(): Observable<any> {
    return this.afAuth.authState
      .pipe(
        filter(authData => !!authData),
        tap((authData: User) => authData.getIdToken().then(idToken => localStorage.setItem('id_token', idToken))),
        switchMap(authData => fromPromise(this.col.doc(authData.uid).ref.get())
          .pipe(
            map(userProfile => {
              const userData = {...userProfile.data(), uid: authData.uid};
              return userData;
            }),
            catchError(error => of(error))
          )));
  }

  login(credentials: UserCredentials): Observable<any> {
    return Observable.fromPromise(
      this.afAuth.auth.signInWithEmailAndPassword(credentials.email, credentials.password)
        .then(authData => authData)
        .catch(err => {
          this.uiService.openSnackBar(this.messages.getMessage(err.code));
          throw new Error(err);
        }));
  }

  logout(): Observable<any> {
    return Observable.fromPromise(this.afAuth.auth.signOut()
      .then((authData) => {
        localStorage.removeItem('id_token');
        this.uiService.openSnackBar(this.messages.getMessage('user-logged-out'));
        return authData;
      }));
  }

  changeMyPassword(credentials: { uid: string; email?: string; oldPassword?: string, password: string }): Observable<any> {
    const cred = firebase.auth.EmailAuthProvider.credential(firebase.auth().currentUser.email, credentials.oldPassword);
    return Observable.fromPromise(
      firebase.auth().currentUser.reauthenticateWithCredential(cred)
        .then(auth => firebase.auth().currentUser.updatePassword(credentials.password))
        .catch(err => {
          console.error(err);
          throw new Error(err);
        }));
  }

  changePassword(payload: { uid: string, password: string }): Observable<any> {
    const url = `https://us-central1-jovisco-invoicing.cloudfunctions.net/users/${payload.uid}`;
    return this.http
      .post<any>(url, payload)
      .pipe(
        tap(response => console.log('RESPONSE FROM CHANGE PASSWORD: ', response)),
        catchError((error: any) => _throw(error))
      );
  }

  getMessage(id: string, params?: string[]): MessageContent {
    if (params && params.length > 0) {
      return this.messages.getMessageWithParams(id, params);
    }
    return this.messages.getMessage(id);
  }
}
