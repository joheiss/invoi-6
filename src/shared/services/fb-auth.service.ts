import {Injectable} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {User} from 'firebase';
import {from, Observable, of, throwError} from 'rxjs/index';
import * as firebase from 'firebase';

@Injectable()
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

  getAuthState(): Observable<User | null> {
    return this.afAuth.authState;
  }

  getIdToken(authData: User): Observable<string> {
    return from(
      authData.getIdToken().then(idToken => idToken)
    );
  }

  logout(): Observable<any> {
    return from(
      this.afAuth.auth.signOut()
    );
  }

  signInWithEmailAndPassword(email: string, password: string): Observable<boolean> {
    return from(
      this.afAuth.auth.signInWithEmailAndPassword(email, password).then(authData => !!authData)
    );
  }
}
