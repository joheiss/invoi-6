import {Injectable} from '@angular/core';
import {auth} from 'firebase';
import {User} from 'firebase/auth';
import {from, Observable} from 'rxjs/index';
import {AngularFireAuth} from '@angular/fire/auth';

@Injectable()
export class FbAuthService {

  constructor(private afAuth: AngularFireAuth) {
  }

  changeMyPassword(credentials: { uid: string; email?: string; oldPassword?: string, password: string }): Observable<any> {
    const cred = auth.EmailAuthProvider.credential(auth().currentUser.email, credentials.oldPassword);
    return from(
      auth().currentUser.reauthenticateWithCredential(cred)
        .then(() => auth().currentUser.updatePassword(credentials.password))
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
