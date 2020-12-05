import {Injectable} from '@angular/core';
import firebase from 'firebase/app';
import {from, Observable, of} from 'rxjs/index';
import {AngularFireAuth} from '@angular/fire/auth';
import {SharedModule} from '../shared.module';
import {catchError, first} from 'rxjs/operators';

@Injectable({
  providedIn: SharedModule
})
export class FbAuthService {

  constructor(private afAuth: AngularFireAuth) {
  }

  changeMyPassword(credentials: { uid: string; email?: string; oldPassword?: string, password: string }): Observable<any> {
    const cred = firebase.auth.EmailAuthProvider.credential(firebase.auth().currentUser.email, credentials.oldPassword);
    return from(
      firebase.auth().currentUser.reauthenticateWithCredential(cred)
        .then(() => firebase.auth().currentUser.updatePassword(credentials.password))
    );
  }

  getAuthState(): Observable<firebase.User | null> {
    return this.afAuth.authState.pipe(
      first(),
      catchError(() => of(null))
    );
  }

  getIdToken(authData: firebase.User): Observable<string> {
    return from(
      authData.getIdToken().then(idToken => idToken)
    );
  }

  logout(): Observable<any> {
    return from(
      this.afAuth.signOut()
      // this.afAuth.auth.signOut()
    );
  }

  signInWithEmailAndPassword(email: string, password: string): Observable<boolean> {
    return from(
      this.afAuth.setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then(() => this.afAuth.signInWithEmailAndPassword(email, password))
        .then(authData => !!authData)
      // this.afAuth.auth.setPersistence(auth.Auth.Persistence.SESSION)
      //   .then(() => this.afAuth.auth.signInWithEmailAndPassword(email, password))
      //   .then(authData => !!authData)
    );
  }
}
